# utils

Repository to hold reusable widgets. Contains:
1. Resuable HTML5/JavaScript based reusable Clock. It has the capability to pick up current time along with setter apis to set the intended time.
   a. Refer Clock.html on how to include the widget.
   
2. Analog Gauge to represent a scalar quantity. It's a resuable widget based on HTML5/JavaScript.
   a. You can define different thresholds(Critical, Normal, Fatal, Warning etc) and their corresponding color and range (0-10 is Normal, 10-20 is warning and so on)
   b. Threshold strip will be drawn at the edge of the gauge as per set values.
   c. Unit of quantity represented can be set
   d. Animation while the needle moves to show the new value.
   e. setValue / setThreshold and other apis to easily configure the widget. Refer Analog.html on how to include this widget.