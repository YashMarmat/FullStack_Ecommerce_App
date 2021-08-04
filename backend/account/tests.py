from account import views
from django.http import response
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import User
from rest_framework.test import force_authenticate
from .models import BillingAddress, OrderModel, StripeModel
from .views import CardsListView, ChangeOrderStatus, CreateUserAddressView, DeleteUserAddressView, OrdersListView, UpdateUserAddressView, UserAccountDeleteView, UserAccountDetailsView, UserAccountUpdateView, UserAddressDetailsView, UserAddressesListView


class AccountApisSetUp(APITestCase):
    
    def setUp(self):

        self.register_url = reverse("register-page")
        self.login_url = reverse("login-page")

        self.user_data = {
            "email": "yashmarmat08@gmail.com",
            "username": "yash",
            "password": "yash1234"
        }

        self.empty_fields = {
            "email": "",
            "username": "",
            "password": ""
        }

        self.admin_user = User.objects.create_superuser(
            username = "admin",
            email = "admin@gmail.com",
            password = "admin1234"
        )

        self.normal_user = User.objects.create_user(
            username = "testuser",
            email = "testuser@gmail.com",
            password = "testuser1234"
        )

        self.dummy_address = BillingAddress.objects.create(
            name = "testuser",
            user = self.normal_user,
            phone_number = "9123456789",
            pin_code = "110000",
            house_no = "somewhere on earth",
            landmark = "near shop",
            city = "new delhi",
            state = "delhi",
        )

        self.dummy_order = OrderModel.objects.create(
            name = "testuser",
            ordered_item = "computer chair", 
            card_number = "4242424242424242", 
            address = "somewhere on earth", 
            paid_status = "True", 
            paid_at = timezone.now(),
            total_price = "5999.99", 
            is_delivered = "False",
            delivered_at = "Not Delivered", 
            user = self.normal_user
        )

        # stripe card of testuser
        self.testuser_stripe_card = StripeModel.objects.create(
            email = "testuser@gmail.com",
            name_on_card = "testuser",
            customer_id = "cus_1234",
            card_number = "1234123412341234",
            exp_month = "08",
            exp_year = "2024",
            card_id = "card_1234",
            user = self.normal_user,
            address_city = "New Delhi",
            address_country = "INDIA",
            address_state = "unknown",
            address_zip = "111222"
        )

        # stripe card of admin
        self.admin_stripe_card = StripeModel.objects.create(
            email = "admin@gmail.com",
            name_on_card = "admin",
            customer_id = "cus_1111",
            card_number = "4242424242424242",
            exp_month = "05",
            exp_year = "2026",
            card_id = "card_5555",
            user = self.admin_user,
            address_city = "New York",
            address_country = "USA",
            address_state = "unknown",
            address_zip = "511111"
        )

class AccountApisAuthTest(AccountApisSetUp):

    def test_user_registration_without_user_data(self):
        response = self.client.post(
            self.register_url, 
            self.empty_fields, 
            format="json"
        )
        # import pdb
        # pdb.set_trace()
        self.assertEqual(response.status_code, 400)

    def test_user_login_without_user_data(self):
        response = self.client.post(
            self.login_url,
            self.empty_fields,
            format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_user_registration_with_user_data(self):
        response = self.client.post(
            self.register_url, self.user_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_user_login_with_user_data(self):
        # register
        self.client.post(
            self.register_url, self.user_data, format="json"
        )
        # login
        res = self.client.post(
            self.login_url, self.user_data, format="json"
        )
        # to see request response use below code (then in terminal type response.data to see details)
        # import pdb
        # pdb.set_trace()
        self.assertEqual(res.status_code, 200)

    def test_user_account_details_page_when_logged_in(self):
        factory =  APIRequestFactory()
        user = User.objects.get(username='admin')
        view = UserAccountDetailsView.as_view()

        request = factory.get('/accounts/user/1/')
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_user_account_details_page_when_logged_out(self):
        response = self.client.get('/accounts/user/1/')
        self.assertEqual(response.status_code, 404)

    def test_user_account_updation_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = UserAccountUpdateView.as_view()

        # only updating the username (you can update anything though)
        updates = {"username": "admin22", "email": "", "password": ""}

        request = factory.put('/accounts/user_update/1/', updates)   
        force_authenticate(request, user=user)     
        update_user = User.objects.get(id='1')
        update_user.username = updates["username"]
        update_user.save()

        response = view(request, 1)
        #print(User.objects.get(id=1))                  # you can check the changes like this
        self.assertEqual(response.status_code, 200)


    def test_user_account_updation_when_logged_out(self):
        updates = {"username": "admin22", "email": "", "password": ""}
        response = self.client.put('/accounts/user_update/1/', updates)
        self.assertEqual(response.status_code, 404)

    def test_user_account_deletion_with_wrong_password(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UserAccountDeleteView.as_view()

        request = factory.post('/accounts/user_delete/2/', {"password": "testuser12"})
        force_authenticate(request, user=user)

        response = view(request, 2)
        self.assertEqual(response.status_code, 401) # Unauthorized

    def test_user_account_deletion_with_correct_password(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UserAccountDeleteView.as_view()

        request = factory.post('/accounts/user_delete/2/', {"password": "testuser1234"})
        force_authenticate(request, user=user)

        response = view(request, 2)
        self.assertEqual(response.status_code, 204)

    def test_user_account_deletion_without_login(self):
        response = self.client.post(('/accounts/user_delete/1/', {"password": "admin1234"}))
        self.assertEqual(response.status_code, 404)

    def test_get_all_the_addresses_of_user_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username="testuser")
        view = UserAddressesListView.as_view()

        request = factory.get('/accounts/all-addresses-details/')
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_get_all_addresses_of_user_when_logged_out(self):
        response = self.client.get('/accounts/all-addresses-details/')
        self.assertEqual(response.status_code, 404)

    def test_address_creation_of_registered_user(self):
        factory = APIRequestFactory()
        user = User.objects.get(username="testuser")
        view = CreateUserAddressView.as_view()

        user_address = {
            "name": "testuser",
            "user": user,
            "phone_number": "9123456789",
            "pin_code": "110000",
            "house_no": "somewhere on earth",
            "landmark": "near shop",
            "city": "new delhi",
            "state": "delhi",
        }

        request = factory.post('/account/create-address/', user_address)
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_address_creation_api_when_logged_out(self):
        user = User.objects.get(username="testuser")

        user_address = {
            "name": "testuser",
            "user": user,
            "phone_number": "9123456789",
            "pin_code": "110000",
            "house_no": "somewhere on earth",
            "landmark": "near shop",
            "city": "new delhi",
            "state": "delhi",
        }

        response = self.client.post('/account/create-address/', user_address)
        self.assertEqual(response.status_code, 401) # Unauthorized

    def test_address_updation_of_registered_user(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UpdateUserAddressView.as_view()

        # updating the dummy address here
        updated_address = {
            "name": "",
            "user": user,
            "phone_number": "",
            "pin_code": "111111",
            "house_no": "",
            "landmark": "",
            "city": "new york",
            "state": "",
        }

        request = factory.put('/account/update-address/1/', updated_address)

        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_address_updation_when_logged_out(self):
        user = User.objects.get(username='testuser')

        # updating the dummy address here
        updated_address = {
            "name": "",
            "user": user,
            "phone_number": "",
            "pin_code": "111111",
            "house_no": "",
            "landmark": "",
            "city": "new york",
            "state": "",
        }

        response = self.client.put('/account/update-address/1/', updated_address)
        self.assertEqual(response.status_code, 401) # Unauthorized

    def test_fetching_address_details_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UserAddressDetailsView.as_view()

        request = factory.get('/accounts/address-details/1/') # 1 is the id of the address (created above)
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_fetching_address_details_when_logged_out(self):
        response = self.client.get('/accounts/address-details/1/') # 1 is the id of the address (created above)
        self.assertEqual(response.status_code, 404)

    def test_delete_user_address_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = DeleteUserAddressView.as_view()
        request = factory.delete('/account/delete-address/1/')

        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 204)

    def test_delete_user_address_when_logged_out(self):
        response = self.client.delete('/account/delete-address/1/')
        self.assertEqual(response.status_code, 403) # Forbidden

    def test_get_orders_list_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = OrdersListView.as_view()
        request = factory.get('/account/all-orders-list/')

        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_get_orders_list_when_logged_out(self):
        response = self.client.get('/account/all-orders-list/')
        self.assertEqual(response.status_code, 401) # Unauthorized
    
    def test_changing_of_order_status_by_admin(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = ChangeOrderStatus.as_view()

        request = factory.put('/account/change-order-status/1/', {
            "is_delivered": "True",
            "delivered_at": timezone.now()
        })
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_changing_of_order_status_by_normal_user(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser') # normal user (not an admin)
        view = ChangeOrderStatus.as_view()

        request = factory.put('/account/change-order-status/1/', {
            "is_delivered": "True",
            "delivered_at": timezone.now()
        })
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 403) # Forbidden

    def test_changing_of_order_status_when_logged_out(self):
        response = self.client.put('/account/change-order-status/1/', {
            "is_delivered": "True",
            "delivered_at": timezone.now()
        })
        self.assertEqual(response.status_code, 401) # Unauthorized

    def test_fetching_of_user_stripe_card_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = CardsListView.as_view()

        request = factory.get('/account/stripe-cards/')
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "testuser") # confirming ===> getting only testuser card
        self.assertNotContains(response, "admin") # confirming ===> not getting admin card
        self.assertContains(response, "1234123412341234") # confirming ===> getting testuser card number only
        self.assertNotContains(response, "4242424242424242") # confirming ===> not getting admin card number


    def test_fetching_of_user_stripe_card_when_logged_out(self):
        response = self.client.get('/account/stripe-cards/')
        self.assertEqual(response.status_code, 401) # Unauthorized
