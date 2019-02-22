# BBC-Trainee-Web
Trainee (Web) BBC News JS Coding Test

I am using WebStorm IDE to create:
* HTML
* JavaScript
* CSS

I have loaded the JSON articles to my existing AWS server at
http://3.8.136.10/bbccodetest/article/

To allow access to files on the server added to httpd config
```apacheconfig
<Directory "/var/www/html/bbccodetest/article">
    Header set Access-Control-Allow-Origin "*"
</Directory>
```


styling