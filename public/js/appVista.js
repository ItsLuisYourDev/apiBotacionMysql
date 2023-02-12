//canvas.height(500);
let adminLogin = false;
var canvas = document.getElementById('myChart');

var ctx = canvas.getContext('2d');
//canvas.height(500);

var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Alcalde 1', 'alcalde 2', 'alcalde 3', 'alcalde 4'],
        datasets: [{
            label: 'Botos',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,



    }
});
$(document).ready(function () {



    var socket = io();

    $("#loginAdmin").click(function () {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

        socket.emit("login_admin", {
            user: $("#userName").val(),
            pass: $("#Password").val()
        });
    });


    socket.on("login_in_admin", function (user, cont, lUsers) {
        // console.log("logeadooooooooooooooo-------" + user, cont)
        adminLogin = true;
        $("#n_log_in").hide();
        $("#botar").show();
        $("#log_in").html("Biembenido " + user + ", xd!" + cont);
        $("#log_in").show();
        $("#messages").show();
        $("#myChart").show();
        $(".mostrarContent").show();
        socket.emit("grafica")

        console.log(lUsers)
        for (let i = 0; i < lUsers.length; i++) {
            const element = lUsers[i];
            var item = document.createElement('li');
            item.textContent = element;
            messages.appendChild(item);
        }
        console.log("dato duplicados xd")

        window.scrollTo(0, document.body.scrollHeight);
        //console.log("ud no a botado:" + boto)
        //const candi = "#candiLabel" + boto
    });



    socket.on("invalid", function () {
        alert("Username / Password Invalid, Please try again!");
    });



    socket.on("error", function () {
        alert("Error: Please try again!");
    });



    socket.on('ioGlobal', function (datos) {

        console.log("entro global")
        var item = document.createElement('li');
        item.textContent = datos;
        if (adminLogin != false) {
            messages.appendChild(item);
        }
        window.scrollTo(0, document.body.scrollHeight);
        console.log(datos)

        // if (cliente=="no_definido") {
        //     window.location.href = "/"; 
        // }
    });


    socket.on('datosGrafica', function (countBoto) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cont = 0;
        console.log("entro xd xd xd ")
        let A1 = countBoto.filter(i => i === 1).length;
        let A2 = countBoto.filter(i => i === 2).length;
        let A3 = countBoto.filter(i => i === 3).length;
        let A4 = countBoto.filter(i => i === 4).length;
        console.log(A1 + "-" + A2 + "-" + A3)
        //! Obtén la referencia del canvas
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Crea una nueva instancia de un gráfico de barras
        chart.data.datasets[0].data = [A1, A2, A3, A4];
        chart.update();


    });



})
// socket.on('refres', function (datos) {
//     //alert("Canvas refrescado");
//     console.log("-------------------------")
//     //$("#myCanvas").load(location.href + " #myCanvas");

//     var canvas = $("#myChart")[0];
//     var ctx = canvas.getContext("2d");

//     // limpia el canvas completo
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     ctx.fillRect(10, 10, 50, 50);
// });



//var ctx = document.getElementById('myChart').getContext('2d');
