"""fyp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin
from rest_framework import routers
import sys,os
from view_sets.employee import EmployeeViewSet,DivergingViewSet,ScatterViewSet,DecisionTree,DecisionTreeAPI,AttributesListViewSet

from view_sets.wordcloud import WordCloudViewSet
router = routers.DefaultRouter()
router.register(r'employees',EmployeeViewSet,r'employee')
router.register(r'diverging',DivergingViewSet,r'diverging')
router.register(r'scatter',ScatterViewSet,r'scatter')
router.register(r'tree',DecisionTree,r'tree')
router.register(r'tup',DecisionTreeAPI,r'tup')
router.register(r'wordcloud',WordCloudViewSet,r'wordcloud')
router.register(r'attributes',AttributesListViewSet,r'attributes')

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'hr/',include('hr.urls')),
    url(r'api/',include(router.urls,namespace='api'))
]
# urlpatterns+=router.urls
