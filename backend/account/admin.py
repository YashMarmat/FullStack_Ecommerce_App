from django.contrib import admin
from .models import StripeModel, BillingAddress, OrderModel

class StripeModelAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "card_number", "user", "exp_month", "exp_year", "customer_id", "card_id")

class BillingAddressModelAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user", "phone_number", "pin_code", "house_no", "landmark", "city", "state")

class OrderModelAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "card_number", "address", "ordered_item", "paid_status", "paid_at", "total_price", "is_delivered", "delivered_at", "user")

admin.site.register(StripeModel, StripeModelAdmin)
admin.site.register(BillingAddress, BillingAddressModelAdmin)
admin.site.register(OrderModel, OrderModelAdmin)