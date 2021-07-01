import stripe
from rest_framework import status
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from account.models import StripeModel, OrderModel
from rest_framework.decorators import permission_classes
from datetime import datetime


# stripe secret test key
stripe.api_key="your secret key here"


def save_card_in_db(cardData, email, cardId, customer_id, user):

    # save card in django stripe model
    StripeModel.objects.create(
        email = email,
        customer_id = customer_id,
        card_number=cardData["number"],
        exp_month = cardData["exp_month"],
        exp_year = cardData["exp_year"],
        card_id = cardId,
        user = user,
    )


# Just for testing
class TestStripeImplementation(APIView):

    def post(self, request):
        test_payment_process = stripe.PaymentIntent.create(
            amount=120,
            currency='inr',
            payment_method_types=['card'],
            receipt_email='yash@gmail.com'
        )

        return Response(data=test_payment_process, status=status.HTTP_200_OK)

# check token expired or not
class CheckTokenValidation(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response("Token is Valid", status=status.HTTP_200_OK)


# to create card token (to validate your card)
class CreateCardTokenView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        card_invalid = False
        data = request.data
        email = request.data["email"]
        cardStatus = request.data["save_card"]

        card_info = data["number"]
        client_card = card_info[slice(12, 16)] # only last 4 digits of card

        # checking for valid user (email associated with card will be checked)
        customer_data = stripe.Customer.list().data
        user_data = []
        for each in customer_data:
            the_card = each.sources.data[0].last4
            user_data.append({"user": {"card_num": the_card, "card_holder": each.email}})

        for each in user_data:
            user_info = each["user"]
            user_card_info = user_info["card_num"]
            user_email_info = user_info["card_holder"] 

            if user_card_info == client_card:
                if user_email_info != email:                
                    return Response({ 
                        "detail": "Your email address does not belong to the provided card." }, 
                        status=status.HTTP_400_BAD_REQUEST)      

        try:
            stripeToken = stripe.Token.create(
                card = {
                "number": data["number"],
                "exp_month": data["exp_month"],
                "exp_year": data["exp_year"],
                "cvc": data["cvc"]
                },
            )

        except stripe.error.CardError as e:
            errorMessage = e.user_message # as per stripe documentation
            return Response({ "detail": errorMessage}, status=status.HTTP_400_BAD_REQUEST)

        
        except stripe.error.APIConnectionError:            
            return Response({ "detail": "Network error, Failed to establish a new connection."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)              
        
        customer_data = stripe.Customer.list(email=email).data

        if len(customer_data) == 0:
            # create customer in stripe (will provide us customer id in response)
            customer = stripe.Customer.create(
                email = request.data["email"],
                description="My new customer"
            )
        else:
            customer = customer_data[0]
            message = "Customer already exists"

            actual_cn = customer.sources.data[0].last4 # holds card number (last four digits)
            actual_em = customer.sources.data[0].exp_month
            actual_ey = customer.sources.data[0].exp_year

            recieved_cn = data["number"]
            last4_recieved_cn = recieved_cn[-4:]
            recieved_em = data["exp_month"]
            recieved_ey = data["exp_year"]

            # comparing the last4 digits of card provided by the user with the last4 digits of card present on stripe
            if actual_cn != last4_recieved_cn or actual_em != recieved_em or actual_ey != recieved_ey:
                card_invalid = True
        
        if card_invalid:         
            return Response({"detail": "Invalid Card Details Provided."}, status=status.HTTP_400_BAD_REQUEST)

        else:
            # creating a card on stripe (getting validated also by the stipe token)
            create_user_card = stripe.Customer.create_source(
                customer["id"],
                source=stripeToken.id,
            )

            # card id got generated at this point

            if cardStatus:
                try:
                    save_card_in_db(data, email, create_user_card.id, customer["id"], request.user)
                    message = {"customer_id": customer["id"], "email": email, "card_data": create_user_card}
                    return Response(message, status=status.HTTP_200_OK)
                except:
                    return Response({ 
                        "detail": "Card already in use, please uncheck save card option or select a card from saved card list."},
                        status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    message = {"customer_id": customer["id"], "email": email, "card_data": create_user_card}
                    return Response(message, status=status.HTTP_200_OK)
                except:
                    return Response({ "detail": "Network Error, please check your internet connection."})

# Charge the customer card
class ChargeCustomerView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            email = request.data["email"]
            customer_data = stripe.Customer.list(email=email).data
            customer = customer_data[0]

            customer_data = stripe.Customer.list(email=request.data["email"]).data

            # make stripe payment (charge the customer) (either use charge api or paymentIntent api)
            stripe.Charge.create(
                customer=customer_data[0],
                amount=int(float(request.data["amount"])*100),
                currency="inr",
                description='Software development services',  # required for Indian transactions
            )

            # saving order in django database
            new_order = OrderModel.objects.create(
                name = data["name"],
                card_number = data["card_number"],
                address = data["address"],
                ordered_item = data["ordered_item"],
                paid_status = data["paid_status"],
                paid_at = datetime.now(),
                total_price = data["total_price"],
                is_delivered = data["is_delivered"],
                delivered_at = data["delivered_at"],
                user = request.user
            )

            return Response(
                data = {
                    "data": {
                        "customer_id": customer.id,
                        "message": "Payment Successfull",
                    }
                }, status=status.HTTP_200_OK)

        except stripe.error.APIConnectionError:            
            return Response({ 
                "detail": "Network error, Failed to establish a new connection."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


# retrieve card (to get user card details)
class RetrieveCardView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request): 
        card_details = stripe.Customer.retrieve_source(
            request.headers["Customer-Id"],
            request.headers["Card-Id"]
        )
        return Response(card_details, status=status.HTTP_200_OK)
        

# update a card
class CardUpdateView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        update_card = stripe.Customer.modify_source(
            data["customer_id"],
            data["card_id"],
            exp_month = data["exp_month"] if data["exp_month"] else None,
            exp_year = data["exp_year"] if data["exp_year"] else None,
            name = data["name_on_card"] if data["name_on_card"] else None,
            address_city = data["address_city"] if data["address_city"] else None,
            address_country = data["address_country"] if data["address_country"] else None,
            address_state = data["address_state"] if data["address_state"] else None,
            address_zip = data["address_zip"] if data["address_zip"] else None,

        )

        # locating stripe object in django database
        obj = StripeModel.objects.get(card_number=request.data["card_number"])
        
        # updating stripe object in django database
        if obj:
            obj.name_on_card = data["name_on_card"] if data["name_on_card"] else obj.name_on_card
            obj.exp_month = data["exp_month"] if data["exp_month"] else obj.exp_month
            obj.exp_year = data["exp_year"] if data["exp_year"] else obj.exp_year
            obj.address_city = data["address_city"] if data["address_city"] else obj.address_city
            obj.address_country = data["address_country"] if data["address_country"] else obj.address_country
            obj.address_state = data["address_state"] if data["address_state"] else obj.address_state
            obj.address_zip = data["address_zip"] if data["address_zip"] else obj.address_zip
            obj.save()
        else:
            pass

        return Response(
            {
                "detail": "card updated successfully",
                "data": { "Updated Card": update_card },

            }, status=status.HTTP_200_OK)
        

# delete card
class DeleteCardView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        obj_card = StripeModel.objects.get(card_number=request.data["card_number"])

        customerId = obj_card.customer_id
        cardId = obj_card.card_id

        # deleting card from stripe
        stripe.Customer.delete_source(
            customerId,
            cardId
        )

        # deleting card from django database
        obj_card.delete()

        # delete the customer
        # as deleting the card will not change the default card number on stripe therefore
        # we need to delete the customer (with a new card request customer will be recreated)
        stripe.Customer.delete(customerId)
        
        return Response("Card deleted successfully.", status=status.HTTP_200_OK)