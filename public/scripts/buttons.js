// console.log(window.location.pathname);

// switch(window.location.pathname){
//     case "/":
//         $("button").removeClass("btn-outline-danger");
//         $("button").addClass("btn-danger");
//         break;

//     case "/iplocator":
//         $("#iplocator").removeClass("btn-danger");
//         $("#iplocator").AddClass("btn-outline-danger");
//         break;

    
// }

var id = "#" + window.location.pathname.substring(1);

// console.log(id);
$("button").removeClass("btn-outline-danger");
$("button").addClass("btn-danger");

if (id != "#"){
    $(id).addClass("btn-outline-danger");
    $(id).removeClass("btn-danger");
}