!function(w,d){
  if(!w.HTMLInclude){
    w.HTMLInclude=function(){
      function isInViewport(element,offset){
        return element.getBoundingClientRect().top<=(+offset+w.innerHeight);
      }
      function ajax(url,elements){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
          if(xhr.readyState==4&&xhr.status==200){
            elements.forEach(function(element){
              var dataReplace=element.getAttribute("data-replace");
              var z=xhr.responseText;

              if(dataReplace){
                dataReplace.split(",").forEach(function(el){
                  var o=el.trim().split(":");
                  z=z.replace(new RegExp(o[0],"g"),o[1]);
                });
              }

              element.outerHTML=z;

              var scripts=(new DOMParser())
                .parseFromString(z,"text/html")
                .querySelectorAll("SCRIPT");

              for(var i=0;i<scripts.length;){
                var s=d.createElement("SCRIPT");

                if(scripts[i].src){
                  s.src=scripts[i].src;
                }else{
                  s.innerHTML=scripts[i].innerHTML;
                }

                d.head.appendChild(s);
                i++;
              }
            });
          }
        };

        xhr.open("GET",url,true);
        xhr.send();
      }

      function lazy(element,offset){
        w.addEventListener("scroll",function handler(){
          if(isInViewport(element,offset)){
            w.removeEventListener("scroll",handler);
            ajax(element.getAttribute("data-include"),[element]);
          }
        });
      }

      var groups={};
      var elements=d.querySelectorAll("[data-include]:not([data-in])");

      for(var i=elements.length;i--;){
        var url=elements[i].getAttribute("data-include");
        var offset=elements[i].getAttribute("data-lazy");

        elements[i].setAttribute("data-in","");

        if(!offset || (offset && isInViewport(elements[i],offset))){
          groups[url]=groups[url]||[];
          groups[url].push(elements[i]);
        }else{
          lazy(elements[i],offset);
        }
      }

      for(var url in groups){
        ajax(url,groups[url]);
      }
    };

    w.HTMLInclude();
  }
}(window,document);
