var myApplication = angular.module('myApplication', ['ngRoute']);

myApplication.config(function ($routeProvider) {

    $routeProvider
    .when('/', {
        templateUrl: 'signon.html',
        controller: 'homeController'
    })
    .when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'dashboardController'
    })
    .when('/sectors', {
        templateUrl: 'sectors.html',
        controller: 'sectorsController'
    })
});

myApplication.controller('homeController', ['$scope', '$http', function ($scope, $http) {

    $scope.username = '';
    $scope.password = '';
    $scope.signin = function () {

        console.log($('#lbl_sigonerror')[0].innerText);
        if ($scope.username != '' && $scope.password != '') {
            $http.get('https://api.mongolab.com/api/1/databases/stocks/collections/users?apiKey=EpThFIOyjKh-WbVlIWEvG0Iq8Pkvoohg&q={ "username" :"' + $scope.username + '","password" :"' + $scope.password + '" }')
            .success(function (result) {
                if (result.length > 0) {
                    $('#lbl_sigonerror')[0].innerText = '';
                    window.location.href = "#/dashboard";
                }
                else {
                    $('#lbl_sigonerror')[0].innerText = 'Login Failed! Please check your credentials and try again';
                }
            })
            .error(function (data, status) { console.log(data) });
        }
    };

}]);
myApplication.controller('dashboardController', ['$scope', '$http', function ($scope, $http) {

    var pos = 0;
    $scope.stockdetails = '';
    $scope.stcokid = '';
    $scope.stockdays = '';
    $scope.stcokname = '';
    $scope.imageurl = 'http://chart.finance.yahoo.com/z?s=';
    $('#div_data').hide();
    $('#div_logout').show();
    $('#lbl_username')[0].innerText = 'Narendra';
    $scope.$watch('stockdays', function () {
        $scope.imageurl = 'http://chart.finance.yahoo.com/z?s=';
        $scope.imageurl += $scope.stcokid;
        $scope.imageurl += '&t=' + $scope.stockdays;
    });

    $http.get('https://api.mongolab.com/api/1/databases/stocks/collections/sp500?apiKey=EpThFIOyjKh-WbVlIWEvG0Iq8Pkvoohg')
            .success(function (result) {
                $.each(result, function (i, val) {
                    $(".txt_source").append("<li class=\"select\" id=\""+ val.Symbol +"\">" + val.Name + "</li>");
                });
            })
            .error(function (data, status) { console.log(data) });

    $("#inputStockName").on("keyup", function (e) {
        if (e.keyCode != 13) {
            var input = $(this).val().toLowerCase();
            if (input != "") {
                $(".txt_source li").each(function () {
                    if ($(this).text().toLowerCase().indexOf(input) >= 0) {
                        $(this).show().removeClass("disable").addClass("enable");
                    } else {
                        $(this).hide().removeClass("enable").addClass("disable");
                    }
                });
            }
            else {
                $(".txt_source li").hide().removeClass("enable").addClass("disable");
            }
        }
    });

    $("ul.txt_source").on("click", "li", function () {
        $("#inputStockName").val($(this).text());
        $(".txt_source li").hide();
        $scope.stcokid = $(this).attr('id');
        $scope.imageurl += $(this).attr('id');
        $scope.imageurl +=  '&t=' + $scope.stockdays;
        $scope.stcokname = $(this).text();
        var theWebAddress = "http://query.yahooapis.com/v1/public/yql?q=";
        theWebAddress += encodeURIComponent('select * from yahoo.finance.quotes where symbol in ("' + $(this).attr('id') + '")');
        theWebAddress += '&format=json';
        theWebAddress += '&env=store://datatables.org/alltableswithkeys';
        //alert(theWebAddress);
        $scope.$apply(function () {
            $http.get(theWebAddress)
            .success(function (result) {
                $('#div_data').show();
                    $.each(result, function (i, val) {
                    $scope.stockdetails = val.results.quote;
                });
                
            })
            .error(function (data, status) { console.log(data) });
        });
    });

}]);
myApplication.controller('sectorsController', ['$scope', '$http', function ($scope, $http) {
     
    $scope.sectorimageurl = '';
    $scope.sectorid = '';
    $scope.sectordetails = '';
    $('#div_secdata').hide();
    $("#ddl_sectors").change(function () {
        
        $('#lbl_sectorp')[0].innerText = 'Sector Performance- ' + $("select option:selected").text();
        $('#my_image').attr('src', 'second.jpg');
        $scope.sectorid = $(this).val();
        $scope.sectorimageurl = 'http://www.barchart.com/imagechart.php?sym=-' + $scope.sectorid + '&notitle=true&width=496&height=154&plot=line';
        var theWebAddress = 'https://api.mongolab.com/api/1/databases/stocks/collections/sp500?apiKey=EpThFIOyjKh-WbVlIWEvG0Iq8Pkvoohg&q={ "Sector" :"' + $("select option:selected").text() + '"}';
        $http.get(theWebAddress)
            .success(function (result) {
                console.log(result);
                $('#div_secdata').show();
                $scope.sectordetails = result;
            })
            .error(function (data, status) { console.log(data) });

        $('#my_image').attr('src', $scope.sectorimageurl);
    });
}]);