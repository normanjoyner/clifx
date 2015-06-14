# clifx

##About

###Description
Command line interface for interacting with LIFX bulbs using LIFX Cloud

###Author
Norman Joyner - norman.joyner@gmail.com

##Getting Started

###Installing
`npm install clifx -g`

###Configuration
`clifx configure --token LIFX_CLOUD_TOKEN`

###Listing Bulbs
List all bulbs:
`clifx list`

List bulbs from a specific group:
`clifx list --group "Living Room"`

###Powering On Bulbs
Power on all bulbs:
`clifx power-on`

Power on a bulb by name:
`clifx power-on --label "Porch"`

###Powering Off Bulbs
Power off all bulbs:
`clifx power-off`

Power off all bulbs by location:
`clifx power-off --location "My Smart House"`

##Contributing
Pull requests and issues are encouraged!
