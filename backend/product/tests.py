from account import views
from django.http import response
from .models import Product
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory
from .views import ProductCreateView, ProductDeleteView, ProductEditView
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile


class ProductApiTest(TestCase):

    def setUp(self):

        # setting up a new product
        self.product = Product.objects.create(
            name='Apple Watch',
            description='Great Watch',
            price=399.99,
            stock=True,
            image='apple.png'
        )

    def test_home_page_api(self):
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, 200)

    def test_string_representation(self):
        product = Product(name="Sample Product")
        self.assertEqual(str(product), "Sample Product")

    def test_product_values(self):
        response = self.client.get(reverse("products-list"))
        self.assertEqual(f"{self.product.name}", "Apple Watch")
        self.assertEqual(f"{self.product.description}", "Great Watch")
        self.assertEqual(f"{self.product.price}", "399.99")
        self.assertEqual(f"{self.product.stock}", "True")
        self.assertEqual(f"{self.product.image}", "apple.png")

    def test_products_list_page_contents(self):
        response = self.client.get(reverse("products-list"))
        self.assertContains(response, "Apple Watch")
        self.assertContains(response, "399.99")
        self.assertContains(response, "apple.png")

    def test_product_details_page(self):
        response = self.client.get("/api/product/1/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Apple Watch")
        self.assertContains(response, "Great Watch")
        self.assertContains(response, "399.99")
        self.assertContains(response, "apple.png")


class ProductApisSetUp(APITestCase):

    def setUp(self):

        # setting up a new product
        self.product = Product.objects.create(
            name='Ghost Recon Wildlands',
            description='Great game',
            price=1224.99,
            stock=True,
            image='no_preview_image.png'
        )

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


class ProductApisAuthTest(ProductApisSetUp):

    def test_address_page_with_login_credentials(self):
        factory = APIRequestFactory()
        view = views.UserAddressesListView.as_view()

        # Make an authenticated request to the view...
        request = factory.get('/accounts/all-address-details/')
        force_authenticate(request, user=1)
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_address_page_without_login_credentials(self):
        response = self.client.get('accounts/all-address-details/')
        self.assertEqual(response.status_code, 404)

    def test_product_create_page_with_non_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser') # not an admin
        view = ProductCreateView.as_view()

        image = SimpleUploadedFile("computer_chair.jpg", content=open("static\images\computer_chair.jpg", 'rb').read(), content_type='image/jpeg')

        new_product = {
            "name": "smart phone",
            "description": "great phone",
            "price": "400.99",
            "stock": "True",
            "image": image,
        }

        # Make an authenticated request to the view...
        request = factory.post('/api/product-create/', new_product)
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 403) # forbidden
    
    def test_product_create_page_with_admin_credentials(self):

        factory = APIRequestFactory()
        user = User.objects.get(username='admin') # admin user
        view = ProductCreateView.as_view()

        image = SimpleUploadedFile("computer_chair.jpg", content=open("static\images\computer_chair.jpg", 'rb').read(), content_type='image/jpeg')

        new_product = {
            "name": "smart phone",
            "description": "great phone",
            "price": "400.99",
            "stock": "True",
            "image": image,
        }

        # Make an authenticated request to the view...
        request = factory.post('/api/product-create/', new_product)
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)
    
    def test_product_edit_page_with_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = ProductEditView.as_view()

        # only updating price (you can update anything though)
        updated_product = {
            "name": "",
            "description": "",
            "price": "400.99",
            "stock": "True",
            "image": "",
        }

        request = factory.put('/api/product-update/1/', updated_product, format="json")

        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)
    
    def test_product_edit_page_without_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = ProductEditView.as_view()

        # only updating price (you can update anything though)
        updated_product = {
            "name": "",
            "description": "",
            "price": "400.99",
            "stock": "True",
            "image": "",
        }

        request = factory.put('/api/product-update/1/', updated_product, format="json")

        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 403) # forbidden

    def test_product_deletion_with_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = ProductDeleteView.as_view()

        request = factory.delete('/api/product-delete/1/')

        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 204) # as after deletion the product is gone, so 204.
    
    def test_product_deletion_without_admin_credentials(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = ProductDeleteView.as_view()

        request = factory.delete('/api/product-delete/1/')

        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 403) # Forbidden

