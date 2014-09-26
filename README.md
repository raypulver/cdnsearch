# cdnsearch

A program to scrape cdnjs for the URL of a given library. Here's how you use it.

    $ npm install -g cdnsearch
    $ cdnsearch jquery
    jquery -> http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js

Or you can pass the -m/--minimal flag to make it output the URL only.

    $ cdnsearch -m jquery
    http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js

cdnsearch searches for an exact match. You can use % as a wildcard character . For example, the following search matches all libraries starting with "jquery":

    $ cdnsearch jquery%

You can also pass the -d/--detailed flag (making a separate HTTP request for each result) to get all relevant URLs associated with the latest version of the library, as well as a short text description.

You can pass multiple search queries to cdnsearch. For example,

    $ cdnsearch angular.js %ui-router
    angular.js -> http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js
    angular-ui-router -> http://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.10/angular-ui-router.min.js

## License
Copyright (c) 2014 Raymond Pulver IV

Licensed under the MIT License
