from django.urls import path
from payments import views


urlpatterns = [
    path('test-payment/', views.TestStripeImplementation.as_view()),
    path('create-card/', views.CreateCardTokenView.as_view()),
    path('charge-customer/', views.ChargeCustomerView.as_view()),
    path('update-card/', views.CardUpdateView.as_view()),    
    path('delete-card/', views.DeleteCardView.as_view()),    
    path('card-details/', views.RetrieveCardView.as_view()),
    path('check-token/', views.CheckTokenValidation.as_view()),
]