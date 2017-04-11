from services.fetcher import get_word_cloud
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from serializers.rest import WordCloudSerializer
import json

class WordCloudViewSet(viewsets.ViewSet):
    serializer_class = WordCloudSerializer

    def list(self,request):
        cloud = get_word_cloud("putin")
        print("values are",cloud.values())
        serializer = WordCloudSerializer(
            instance = cloud.values(), many=True
        )

        return Response(serializer.data)

# class ImpactScorer(viewsets.ViewSet):

#     def list(self,request):
#         screen_name= request.query_params['impact']
#         k = Klout("vqex3snhkfyvpq2ncpjjettx")
#         kloutId  = k.identity.klout(screenname=screen_name).get('id')

#         score = k.user.score(kloutId=kloutId).get('score')
#         return Response(json.dumps(score))