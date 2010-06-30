Endlessly Unobtrusive
=====================

Summary
-------

Simple UJS endless page class for Prototype.  I use it with Rails, but you can
use it with anything.  All you need to do is add an element with a 
'data-endless' attribute containing the URL to hit to get more elements for
the page and when that element is visible in the browser viewport it will
call out for more content.
I assume that your application takes a ?page= attribute in order to handle
pagination.

Element
-------

All that is required is any HTML element with at least the 'data-endless'
attribute attached.  This element should be placed at or near the bottom
of the page, which can optionally contain a child element of class
'loading' which can be used as a visual cue to the user while content is 
being loaded.

Attributes:
* data-endless
  This attribute is required and should contain the URI to send the AJAX
  request to to get more content.
* data-page
  This optional attribute has the current page number, usually just 1.
* data-method
  This optional attribute specifies the HTTP method to use in the request
  defaults to 'get'.

Example
-------

My page's html output contains lots of posts, then at the end of the page
contains:

    <div data-endless="/posts.js">
      <img class="loading" src="/images/spinner.gif" style="display: none;" />
    </div>

When we detect that this div is visible within the browser viewport we
effect the spinner image into visibility and do the Ajax call to /posts.js
passing a page= parameter with the page number incremented by one.
The template for posts.js should render out something like the following:

    Endless.element.insert({ before: '<p>I am a post</p>' })
    Endless.element.insert({ before: '<p>I am another post</p>' })
    Endless.element.insert({ before: '<p>etc</p>' })

Optionally, if no more content is available to display it should return

    Endless.finished = true;


