var BY = BY || {};
BY.config = BY.config || {};
BY.config.product = BY.config.product || {};

BY.config.product.ecomTrackOrderConfig = {
    "awb_number" : 0,
    "orderid" : 1,
    "actual_weight" : 2,
    "origin" : 3,
    "destination" : 4,
    "location_name" : 5,
    "current_location_name" : 6,
    "customer" : 7,
    "consignee" : 8,
    "pickupdate" : 9,
    "status" : 10,
    "reason_code" : 11,
    "reason_code_number" : 12,
    "reason_code_description" : 13,
    "receiver" : 14,
    "expected_date" : 15,
    "last_update_date" : 16,
    "delivery_date" : 17,
    "ref_awb" : 18,
    "rts_shipment" : 19,
    "system_delivery_update" : 20
}

BY.config.product.pickupPoints = [
    {"address" : {
        city: "Bangalore",
        country: "India",
        locality: "koramangala 1 block",
        streetAddress: "No 48 2nd main koramangala 1 block near Raheja Residency",
        zip: "560034"
        },
    "id" : 1000
    }
]

BY.config.product.deliveryMode = {
    DELIVER : 0,
    PICKUP : 1
}

