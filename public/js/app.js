$(document).ready(function () {


    var socket = io();

    $("#Register").click(function () {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        socket.emit("register", {
            user: $("#userName").val(),
            pass: $("#Password").val()
        });
        socket.on("usuario_creado", function () {
            console.log("fffffffffffff")
            console.log("Error! usuario ya ingresado");
            document.getElementById("Duplicado").innerHTML = "Usuario creado puede inciar secion"
        });
        socket.on("usuario_existe", function () {
            console.log("fffffffffffff")
            console.log("Error! usuario ya ingresado");
            document.getElementById("Duplicado").innerHTML = "Usuario existente"
        });

    });






    $("#Login_Register").click(function () {
        console.log("emitiendo")
        socket.emit("login_register", {
            user: $("#userName").val(),
            pass: $("#Password").val()

        });

    });

    socket.on("logged_in", function (user, cont, boto) {
        // console.log("logeadooooooooooooooo-------" + user, cont)
        $("#n_log_in").hide();
        $("#botar").show();
        $("#log_in").html("biembenido " + user + ", Se feliz!" + cont);
        $("#log_in").show();

        console.log("ud no a botado:" + boto)
        const candi = "#candiLabel" + boto
        if (boto == 0) {
            //console.log("no a botado")

        } else {
            //  console.log("ya boto: "+boto)
            $(".candidatoHide").hide();

            $(candi).css('background', 'blue')

        }

    });



    socket.on("invalid", function () {
        alert("Username / Password Invalid, Please try again!");
    });

    socket.on("error", function () {
        alert("Error: Please try again!");
    });

    socket.on("usuario_no_existe", function () {
        alert("El usuario no existe");
    });



    $("#salir").click(function () {
        socket.emit("salir");

    });










    $("#candidato1").click(function () {
        console.log("boto" + $("#candidato1").val())
        socket.emit("botacion", {
            boto: $("#candidato1").val()
        });
        $(".candidatoHide").hide();
        const candi = "#candiLabel" + $("#candidato1").val()
        $(candi).css('background', 'blue')
        //socket.emit('grafica')

    });

    $("#candidato2").click(function () {
        console.log("boto" + $("#candidato2").val())
        socket.emit("botacion", {
            boto: $("#candidato2").val()
        });
        $(".candidatoHide").hide();
        const candi = "#candiLabel" + $("#candidato2").val()
        $(candi).css('background', 'blue')
        // socket.emit('grafica')

    });

    $("#candidato3").click(function () {
        console.log("boto" + $("#candidato3").val())
        socket.emit("botacion", {
            boto: $("#candidato3").val()
        });
        $(".candidatoHide").hide();
        const candi = "#candiLabel" + $("#candidato3").val()
        $(candi).css('background', 'blue')
        // socket.emit('grafica',"sw")

    });


    $("#candidato4").click(function () {
        console.log("boto" + $("#candidato4").val())
        socket.emit("botacion", {
            boto: $("#candidato4").val()
        });
        $(".candidatoHide").hide();
        const candi = "#candiLabel" + $("#candidato4").val()
        $(candi).css('background', 'blue')
        // socket.emit('grafica',"sw")

    })
});