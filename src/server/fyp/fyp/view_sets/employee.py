from serializers.rest import EmployeeSerializer,DivergingSerializer,ScatterSerializer,DecisionTreeSerializer
# from rest_framework_mongoengine import viewsets
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from services.fetcher import count_by_attr,count_group_by_attr,get_scatter
from rest_framework import status

tree = {"tree":{"name":"OverTime","split":"No","left":"=","right":"=", "children":[ {"name":"Age","split":"21.5","left":">=","right":"<", "children":[ {"name":"leaf","yes": 61 , "no": 618 } , {"name":"DailyRate","split":"623.5","left":">=","right":"<", "children":[ {"name":"leaf","yes": 2 , "no": 10 } , {"name":"leaf","yes": 9 , "no": 2 } ] } ] } , {"name":"MonthlyIncome","split":"3485","left":">=","right":"<", "children":[ {"name":"JobRole","split":"Healthcare Representative,Manager,Manufacturing Director,Research Director,Research Scientist","left":"=","right":"=", "children":[ {"name":"leaf","yes": 12 , "no": 104 } , {"name":"MaritalStatus","split":"Divorced,Married","left":"=","right":"=", "children":[ {"name":"leaf","yes": 10 , "no": 44 } , {"name":"MonthlyIncome","split":"4724.5","left":"<","right":">=", "children":[ {"name":"leaf","yes": 1 , "no": 6 } , {"name":"JobSatisfaction","split":"3.5","left":">=","right":"<", "children":[ {"name":"leaf","yes": 3 , "no": 5 } , {"name":"leaf","yes": 12 , "no": 1 } ] } ] } ] } ] } , {"name":"StockOptionLevel","split":"0.5","left":">=","right":"<", "children":[ {"name":"BusinessTravel","split":"Non-Travel,Travel_Rarely","left":"=","right":"=", "children":[ {"name":"TrainingTimesLastYear","split":"2.5","left":">=","right":"<", "children":[ {"name":"leaf","yes": 1 , "no": 15 } , {"name":"HourlyRate","split":"66","left":">=","right":"<", "children":[ {"name":"leaf","yes": 1 , "no": 7 } , {"name":"leaf","yes": 9 , "no": 4 } ] } ] } , {"name":"leaf","yes": 8 , "no": 3 } ] } , {"name":"DistanceFromHome","split":"9.5","left":"<","right":">=", "children":[ {"name":"EducationField","split":"Life Sciences,Medical","left":"=","right":"=", "children":[ {"name":"leaf","yes": 7 , "no": 11 } , {"name":"leaf","yes": 13 , "no": 2 } ] } , {"name":"leaf","yes": 18 , "no": 1 } ] } ] } ] } ] }}


class EmployeeViewSet(viewsets.ViewSet):
    # lookup_field = 'id'
    serializer_class = EmployeeSerializer

    def list(self,request):
        
        dat = count_by_attr(request.query_params['q'])
        serializer = EmployeeSerializer(
            instance = dat.values(), many=True
        )    
        return Response(serializer.data)

class DivergingViewSet(viewsets.ViewSet):
    serializer_class = DivergingSerializer

    def list(self,request):
        
        dat = count_group_by_attr(
            request.query_params['x'],
            request.query_params['y']
            )
        print(dat.values())
        serializer = DivergingSerializer(
            instance = dat.values(),many=True
        )
        return Response(serializer.data)

class ScatterViewSet(viewsets.ViewSet):
    serializer_class = ScatterSerializer

    def list(self,request):
        dat = get_scatter(
            request.query_params['x'],
            request.query_params['y'],
            request.query_params['z']
        )
        serializer = ScatterSerializer(
            instance=dat.values(),many=True
        )
        return Response(serializer.data)

class DecisionTree(viewsets.ViewSet):
    serializer_class = DecisionTreeSerializer
    print(tree)    
    def list(self,request):
        serializer = DecisionTreeSerializer(
        instance = tree
        )
        return Response(serializer.data)

class DecisionTreeAPI(APIView):

    def get(self,request,*args,**kwargs):
        print(request.GET)
        response = Response((1,2,3))
        return response