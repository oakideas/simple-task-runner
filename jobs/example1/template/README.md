### I'm using this pattern to fill the expression on dynamic fields inside template

```
path = thisProject.fullPath.split('/')
path = path.splice(0,path.length-2).join('/')
$.evalFile(path + "/output/data.js");
data.objects[0].name

```

NOTES: 
1 - path.lenght-2 will go up 1 leval to find the folder output from example, use path.length-1 if you put configure to output be recorded in template folder.
2 - if you are using an windows system, change '/' to '\\'
3 - the composition name defined must exists in the eap projet with the same name.