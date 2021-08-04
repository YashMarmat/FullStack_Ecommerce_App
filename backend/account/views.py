from .models import StripeModel, BillingAddress, OrderModel
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework import authentication, permissions
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from rest_framework_simplejwt.views import TokenObtainPairView # for login page
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from .serializers import (
    UserSerializer, 
    UserRegisterTokenSerializer, 
    CardsListSerializer, 
    BillingAddressSerializer,
    AllOrdersListSerializer
)


# register user
class UserRegisterView(APIView):
    """To Register the User"""

    def post(self, request, format=None):
        data = request.data # holds username and password (in dictionary)
        username = data["username"]
        email = data["email"]

        if username == "" or email == "":
            return Response({"detial": "username or email cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            check_username = User.objects.filter(username=username).count()
            check_email =  User.objects.filter(email=email).count()

            if check_username:
                message = "A user with that username already exist!"
                return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
            if check_email:
                message = "A user with that email address already exist!"
                return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
            else:
                user = User.objects.create(
                    username=username,
                    email=email,
                    password=make_password(data["password"]),
                )
                serializer = UserRegisterTokenSerializer(user, many=False)
                return Response(serializer.data)

# login user (customizing it so that we can see fields like username, email etc as a response 
# from server, otherwise it will only provide access and refresh token)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserRegisterTokenSerializer(self.user).data

        for k, v in serializer.items():
            data[k] = v
        
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# list all the cards (of currently logged in user only)
class CardsListView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # show stripe cards of only that user which is equivalent 
        #to currently logged in user
        stripeCards = StripeModel.objects.filter(user=request.user)
        serializer = CardsListSerializer(stripeCards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# get user details
class UserAccountDetailsView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except:
            return Response({"details": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# update user account
class UserAccountUpdateView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        user = User.objects.get(id=pk)
        data = request.data

        if user:
            if request.user.id == user.id:
                user.username = data["username"]
                user.email = data["email"]

                if data["password"] != "":
                    user.password = make_password(data["password"])

                user.save()
                serializer = UserSerializer(user, many=False)
                message = {"details": "User Successfully Updated.", "user": serializer.data}
                return Response(message, status=status.HTTP_200_OK)
            else:
                return Response({"details": "Permission Denied."}, status.status.HTTP_403_FORBIDDEN)
        else:
            return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# delete user account
class UserAccountDeleteView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):

        try:
            user = User.objects.get(id=pk)
            data = request.data

            if request.user.id == user.id:
                if check_password(data["password"], user.password):
                    user.delete()
                    return Response({"details": "User successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"details": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"details": "Permission Denied."}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# get billing address (details of user address, all addresses)
class UserAddressesListView(APIView):

    def get(self, request):
        user = request.user
        user_address = BillingAddress.objects.filter(user=user)
        serializer = BillingAddressSerializer(user_address, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


# get specific address only
class UserAddressDetailsView(APIView):

    def get(self, request, pk):
        user_address = BillingAddress.objects.get(id=pk)
        serializer = BillingAddressSerializer(user_address, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


# create billing address
class CreateUserAddressView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        
        new_address = {
            "name": request.data["name"],
            "user": request.user.id,
            "phone_number": request.data["phone_number"],
            "pin_code": request.data["pin_code"],
            "house_no": request.data["house_no"],
            "landmark": request.data["landmark"],
            "city": request.data["city"],
            "state": request.data["state"],
        }

        serializer = BillingAddressSerializer(data=new_address, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# edit billing address
class UpdateUserAddressView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        data = request.data

        try:
            user_address = BillingAddress.objects.get(id=pk)

            if request.user.id == user_address.user.id:

                updated_address = {
                    "name": data["name"] if data["name"] else user_address.name,
                    "user": request.user.id,
                    "phone_number": data["phone_number"] if data["phone_number"] else user_address.phone_number,
                    "pin_code": data["pin_code"] if data["pin_code"] else user_address.pin_code,
                    "house_no": data["house_no"] if data["house_no"] else user_address.house_no,
                    "landmark": data["landmark"] if data["landmark"] else user_address.landmark,
                    "city": data["city"] if data["city"] else user_address.city,
                    "state": data["state"] if data["state"] else user_address.state,
                }

                serializer = BillingAddressSerializer(user_address, data=updated_address)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)


# delete address
class DeleteUserAddressView(APIView):

    def delete(self, request, pk):
        
        try:
            user_address = BillingAddress.objects.get(id=pk)

            if request.user.id == user_address.user.id:
                user_address.delete()
                return Response({"details": "Address successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)


# all orders list
class OrdersListView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        user_staff_status = request.user.is_staff
        
        if user_staff_status:
            all_users_orders = OrderModel.objects.all()
            serializer = AllOrdersListSerializer(all_users_orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            all_orders = OrderModel.objects.filter(user=request.user)
            serializer = AllOrdersListSerializer(all_orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

# change order delivered status
class ChangeOrderStatus(APIView):

    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        data = request.data       
        order = OrderModel.objects.get(id=pk)

        # only update this
        order.is_delivered = data["is_delivered"]
        order.delivered_at = data["delivered_at"]
        order.save()
        
        
        serializer = AllOrdersListSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
