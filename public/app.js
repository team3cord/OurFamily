var pullPix=angular.module("pullPix",[]);angular.module("pullPix").controller("ListCtrl",["$scope","ListSvc",function(t,s){t.ListAdd=function(){t.listBody&&s.create({body:t.listBody}).success(function(s){console.log("success"),t.posts.unshift(s),t.listBody=null}),console.log("JSON fail.")},s.fetch().success(function(s){t.posts=s})}]),angular.module("pullPix").service("ListSvc",["$http",function(t){this.fetch=function(){return t.get("http://localhost:3000/api/posts")},this.create=function(s){return console.log(s+"listsvc"),console.log("list service"),t.post("http://localhost:3000/api/posts",s)}}]);