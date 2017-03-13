from mongoengine import Document,fields

class Employee(Document):
    id = fields.IntField()
    label = fields.StringField(required=True)
    description = fields.StringField(required=True)

