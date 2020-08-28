//
var reloj = '';
var hora = 0;
var minuto = 0;
var tipoHora = '';
var intervaloActualizarPersonas;
//-----------------------------Reloj en vivo------------------------------------

function show5() {
    if (!document.layers && !document.all && !document.getElementById)
        return;

    var Digital = new Date();
    var hours = Digital.getHours();
    var minutes = Digital.getMinutes();
    var seconds = Digital.getSeconds();

    var dn = "PM";
    if (hours < 12)
        dn = "AM";
    if (hours > 12)
        hours = hours - 12;
    if (hours == 0)
        hours = 12;

    if (minutes <= 9)
        minutes = "0" + minutes;
    if (seconds <= 9)
        seconds = "0" + seconds;
    //change font size here to your desire
    myclock = hours + ":" + minutes + ":" + seconds + " " + dn;
    //
    tipoHora = dn;
    myclock2 = hours + ":" + minutes;
    hora = parseInt(hours);
    minuto = parseInt(minutes);

    if (document.layers) {
        document.layers.liveclock.document.write(myclock);
        document.layers.liveclock.document.close();
    } else if (document.all)
        liveclock.innerHTML = myclock;
    else if (document.getElementById)
        reloj = myclock2;
}

//-----------------------------------App----------------------------------------

//
var arrayRegistro = [];

//
var app = new Framework7({
    // App root element
    root: '#contadorES2',
    // App Name
    name: 'contadorES2',
    // App id
    id: 'com.contadorES2',
    // Enable swipe panel
    panel: {
        swipe: 'left'
    },
    // Add default routes
    routes: [
        {
            path: '/index/',
            url: 'index.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    cargarSectores();
                }
            }
        },
        {
            path: '/home/',
            url: 'home.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    cargarSlider();
                    $$('#nombreEmp').html(localStorage.nombre);
                    actualizarPersonas();
                }
            }
        },
        {
            path: '/perfil/',
            url: 'perfil.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    setTimeout(function () {
                        //
                        cargarDepartamentos('editarEmpresa');
                        cargarSelectSectores(2);
                        cargarPerfil();
                    }, 50);
                }
            }
        },
        {
            path: '/entrada/',
            url: 'entrada.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    actualizarPersonas();
                }
            }
        },
        {
            path: '/salida/',
            url: 'salida.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    actualizarPersonas();
                }
            }
        }
    ],
    lazy: {
        threshold: 50,
        sequential: false
    }
    // ... other parameters
});

//
var $$ = Dom7;

//
var mainView = app.views.create('.view-main');

//
//var urlServidor = 'http://167.71.248.182/contadorES2Php/';
//var urlImagenSlider = 'http://167.71.248.182/contadorES2Admin/imagenes/sliders/';
var urlServidor = 'http://192.168.0.47/contadorES2Php/';
var urlImagenSlider = 'http://192.168.0.47/contadorES2Admin/imagenes/sliders/';
var urlReportes = urlServidor + 'reportes/';

//
var foto = '';
var canvas = document.getElementById("micanvas");
var preload = true;

//
document.addEventListener('deviceready', function () {
    //
//    setTimeout("show5()", 1000);
    //
    if (preload) {
        //
        app.popup.open('.popup-preload', true);
        //
        setTimeout(function () {
            //
            app.popup.close('.popup-preload', true);
        }, 3000);
        //
        preload = false;
    }
    //
    serial.requestPermission(successS, error);
    //
    if (localStorage.idUsu === undefined) {
        //
        $$('#btnMenu').css('display', 'none');
        $$('#btnEntradaMenu').css('display', 'none');
        $$('#btnSalidaMenu').css('display', 'none');
        $$('#btnCerrarSesionMenu').css('display', 'none');
    } else {
        //
        $$('#btnEntradaMenu').css('display', '');
        $$('#btnSalidaMenu').css('display', '');
        $$('#btnCerrarSesionMenu').css('display', '');
        //
        app.views.main.router.navigate('/home/');
        //
        intervaloActualizarPersonas = setInterval(function () {
            //
            actualizarPersonas();
        }, 5000);
        //
        if (localStorage.limite === undefined || localStorage.limite === '') {
            //
            setTimeout(function () {
                //
                consultarLimitePersonas();
            }, 3100);
        }
    }
    //
    if (localStorage.sectores === undefined) {
        //
        cargarSectores();
    }
}, false);

//--------------------------------Login-----------------------------------------

//
function cargarSelectsRegistro() {
    //
    cargarDepartamentos('registro');
    cargarSelectSectores(1);
}

//
function cargarSectores() {
    //
    app.request.post(urlServidor + 'Read/cargarSectores', {}, function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        localStorage.sectores = JSON.stringify(data);
    });
}

//
function cargarSelectSectores(valor) {
    //
    var campos = '';
    //
    let sectores = JSON.parse(localStorage.sectores);
    //
    if (sectores.length > 0) {
        //
        if (valor === 2) {
            //
            campos += '<option value="" disabled>Selecciona sector</option>';
            //
            for (var i = 0; i < sectores.length; i++) {
                //
                if (sectores[i]['idSec'] === localStorage.sector) {
                    //
                    campos += '<option value="' + sectores[i]['idSec'] + '" selected>' + sectores[i]['nombre'] + '</option>';
                } else {
                    //
                    campos += '<option value="' + sectores[i]['idSec'] + '">' + sectores[i]['nombre'] + '</option>';
                }
            }
            //
            $$('#sectorP').html(campos);
        } else {
            //
            campos += '<option value="" selected disabled>Selecciona sector</option>';
            //
            for (var i = 0; i < sectores.length; i++) {
                //
                campos += '<option value="' + sectores[i]['idSec'] + '">' + sectores[i]['nombre'] + '</option>';
            }
            //
            $$('#sectorR').html(campos);
        }
    }
}

//
function login() {
    //
//    let formData = new FormData($$("#formLogin")[0]);
    var formElement = document.getElementById("formLogin");
    formData = new FormData(formElement);
    //
    app.request({
        url: urlServidor + 'Read/login',
        data: formData,
        method: "POST",
        beforeSend: function () {
            //
            app.preloader.show();
        },
        success: function (rsp) {
            //
            var data = JSON.parse(rsp);
            //
            if (data.estado == 'Entra') {
                //
                localStorage.idUsu = data.idUsu;
                localStorage.rol = data.rol;
                localStorage.nombre = data.nombre;
                localStorage.nit = data.nit;
                localStorage.estadoU = data.estadoU;
                localStorage.correo = data.correo;
                localStorage.idCiu = data.idCiu;
                localStorage.idDep = data.idDep;
                localStorage.sector = data.sector;
                localStorage.idSed = data.idSed;
                localStorage.password = data.password;
                //
                if (data.estadoP === 'Recuperando') {
                    //
                    app.preloader.hide();
                    //
                    app.dialog.prompt('Ingresa nueva contraseña', 'Atención!', function (pass) {
                        //
                        app.request({
                            url: urlServidor + 'Update/actualizarPass',
                            data: {pass: pass, idUsu: data.idUsu},
                            method: "post",
                            beforeSend: function () {
                                //
                                app.preloader.show();
                            },
                            success: function (rsp2) {
                                //
                                if (rsp2 === 'Actualizada') {
                                    //
                                    $$('#btnEntradaMenu').css('display', '');
                                    $$('#btnSalidaMenu').css('display', '');
                                    $$('#btnCerrarSesionMenu').css('display', '');
                                    //
                                    app.preloader.hide();
                                    //
                                    app.popup.close('.popup-login', true);
                                    app.views.main.router.navigate('/home/');
                                    //
                                    if (localStorage.limite === undefined || localStorage.limite === '') {
                                        //
                                        consultarLimitePersonas();
                                    }
                                    //
                                    intervaloActualizarPersonas = setInterval(function () {
                                        //
                                        actualizarPersonas();
                                    }, 5000);
                                } else {
                                    //
                                    app.preloader.hide();
                                    modal = app.dialog.create({
                                        title: 'Atención!',
                                        text: 'Error al actualizar la contraseña!',
                                        buttons: [{text: 'OK'}]
                                    }).open();
                                }
                            },
                            error: function (xhr) {
                                console.log(xhr);
                                app.preloader.hide();
                                modal = app.dialog.create({
                                    title: 'Atención!',
                                    text: 'Error de conexión!',
                                    buttons: [{text: 'OK'}]
                                }).open();
                            },
                            complete: function () {
                                //
                            }
                        });
                    });
                } else {
                    //
                    $$('#btnEntradaMenu').css('display', '');
                    $$('#btnSalidaMenu').css('display', '');
                    $$('#btnCerrarSesionMenu').css('display', '');
                    //
                    app.preloader.hide();
                    //
                    app.popup.close('.popup-login', true);
                    app.views.main.router.navigate('/home/');
                    //
                    if (localStorage.limite === undefined || localStorage.limite === '') {
                        //
                        consultarLimitePersonas();
                    }
                    //
                    intervaloActualizarPersonas = setInterval(function () {
                        //
                        actualizarPersonas();
                    }, 5000);
                }
            } else {
                //
                app.preloader.hide();
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'El correo ingresado no se encuentra registrado o la contraseña es incorrecta!',
                    buttons: [{text: 'OK'}]
                }).open();
            }
        },
        error: function (xhr, e) {
            app.preloader.hide();
            console.log(xhr);
//            alert(JSON.stringify(xhr) + ' _ ' + JSON.stringify(e) + ' ' + $$('#correo').val() + ' - ' + $$('#password').val());
            modal = app.dialog.create({
                title: 'Atención!',
                text: 'Error de conexión!',
                buttons: [{text: 'OK'}]
            }).open();
        }
    });
}

//
function recuperarPass() {
    //
    app.dialog.prompt('Ingresa el correo', 'Atención!', function (correo) {
        //
        app.request({
            url: urlServidor + 'Read/recuperarPass',
            data: {correo: correo},
            method: "POST",
            beforeSend: function () {
                //
                app.preloader.show();
            },
            success: function (rsp) {
                //
                app.preloader.hide();
                //
                if (rsp == 'Enviado') {
                    //
                    app.preloader.hide();
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'La contraseña ha sido enviada al correo ingresado!',
                        buttons: [{text: 'OK'}]
                    }).open();
                } else {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'El correo ingresado no se encuentra registrado!',
                        buttons: [{text: 'OK'}]
                    }).open();
                }
            },
            error: function (xhr, e) {
                app.preloader.hide();
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'Error de conexión!',
                    buttons: [{text: 'OK'}]
                }).open();
            }
        });
    });
}

//
function logout() {
    //
    delete localStorage.idUsu;
    delete localStorage.nombre;
    delete localStorage.nit;
    delete localStorage.estadoU;
    delete localStorage.correo;
    delete localStorage.idCiu;
    delete localStorage.rol;
    delete localStorage.sector;
    delete localStorage.idSed;
    delete localStorage.idDep;
    delete localStorage.password;
    delete localStorage.sectores;
    delete localStorage.limite;
    //
    $$('#btnMenu').css('display', 'none');
    $$('#btnEntradaMenu').css('display', 'none');
    $$('#btnSalidaMenu').css('display', 'none');
    $$('#btnCerrarSesionMenu').css('display', 'none');
    //
    clearInterval(intervaloActualizarPersonas);
}

//-------------------------------------Registro---------------------------------

//
function registro() {
    //
    if ($$('#passwordR').val() !== $$('#passwordRC').val()) {
        //
        modal = app.dialog.create({
            title: 'Atención!',
            text: 'Las contraseñas no coinciden!',
            buttons: [{text: 'OK'}]
        }).open();
    } else {
        //
//    let formData = new FormData($$("#formLogin")[0]);
        var formElement = document.getElementById("formRegistro");
        formData = new FormData(formElement);
        //
        app.request({
            url: urlServidor + 'Create/registro',
            data: formData,
            method: "POST",
            beforeSend: function () {
                //
                app.preloader.show();
            },
            success: function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                app.preloader.hide();
                //
                if (data.estado == 'registrada') {
                    //
                    app.popup.close('.popup-registro', true);
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Registrado con exito!',
                        buttons: [{text: 'OK'}]
                    }).open();
                } else if (data.estado == 'existe') {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'El correo ya se encuentra registrado!',
                        buttons: [{text: 'OK'}]
                    }).open();
                } else if (data.estado == 'error') {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Error al registrar empresa!',
                        buttons: [{text: 'OK'}]
                    }).open();
                } else {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Error al registrar sede!',
                        buttons: [{text: 'OK'}]
                    }).open();
                }
            },
            error: function (xhr, e) {
                app.preloader.hide();
                console.log(xhr);
//            alert(JSON.stringify(xhr) + ' _ ' + JSON.stringify(e) + ' ' + $$('#correo').val() + ' - ' + $$('#password').val());
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'Error de conexión!',
                    buttons: [{text: 'OK'}]
                }).open();
            }
        });
    }
}

//
function cargarDepartamentos(valor) {
    //
    var campo = '';
    //
    if (valor === 'registro') {
        //
        campo = '#departamento';
    } else if (valor === 'registroS') {
        //
        campo = '#departamentoS';
        //
    } else if (valor === 'editarEmpresa') {
        //
        campo = '#departamentoP';
    }
    //
    app.request.post(urlServidor + 'Read/cargarDepartamentos', {}, function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        var campos = '';
        //
        if (data.length > 0) {
            //
            if (campo === '#departamentoP') {
                //
                campos += '<option value="" disabled>Selecciona departamento</option>';
                //
                for (var i = 0; i < data.length; i++) {
                    //
                    if (data[i]['cod'] === localStorage.idDep) {
                        //
                        campos += '<option value="' + data[i]['cod'] + '" selected>' + data[i]['departamento'] + '</option>';
                    } else {
                        //
                        campos += '<option value="' + data[i]['cod'] + '">' + data[i]['departamento'] + '</option>';
                    }
                }
            } else {
                //
                campos += '<option value="" selected disabled>Selecciona departamento</option>';
                //
                for (var i = 0; i < data.length; i++) {
                    //
                    campos += '<option value="' + data[i]['cod'] + '">' + data[i]['departamento'] + '</option>';
                }
            }
            //
            $$(campo).html(campos);
            //
            if (campo === '#departamentoP') {
                //
                cargarCiudades('editarEmpresa');
            }
        }
    });
}

//
function cargarCiudades(valor) {
    //
    var campo = '';
    var depCodigo = '';
    //
    if (valor === 'registro') {
        //
        campo = '#ciudad';
        depCodigo = $$('#departamento').val();
    } else if (valor === 'registroS') {
        //
        campo = '#ciudadS';
        depCodigo = $$('#departamentoS').val();
        //
    } else if (valor === 'editarS') {
        //
        campo = '#ciudadSe';
        depCodigo = $$('#departamentoSe').val();
        //
    } else if (valor === 'editarEmpresa') {
        //
        campo = '#ciudadP';
        depCodigo = $$('#departamentoP').val();
    }
    //
    app.request.post(urlServidor + 'Read/cargarCiudades', {codDep: depCodigo}, function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        var campos = '';
        //
        if (data.length > 0) {
            //
            if (campo === '#ciudadP') {
                //
                campos += '<option value="" disabled>Selecciona ciudad</option>';
                //
                for (var i = 0; i < data.length; i++) {
                    //
                    if (data[i]['cod'] === localStorage.idCiu) {
                        //
                        campos += '<option value="' + data[i]['cod'] + '" selected>' + data[i]['ciudad'] + '</option>';
                    } else {
                        //
                        campos += '<option value="' + data[i]['cod'] + '">' + data[i]['ciudad'] + '</option>';
                    }
                }
            } else {
                //
                campos += '<option value="" selected disabled>Selecciona ciudad</option>';
                //
                for (var i = 0; i < data.length; i++) {
                    //
                    campos += '<option value="' + data[i]['cod'] + '">' + data[i]['ciudad'] + '</option>';
                }
            }
            //
            $$(campo).html(campos);
        }
    });
}

//---------------------------------Home-----------------------------------------

//
var poblacionA = 0;

//
function actualizarPersonas() {
    //
    app.request.post(urlServidor + 'Read/actualizarPersonas', {idEmp: localStorage.idUsu, idSed: localStorage.idSed}, function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if (data.length > 0) {
            //
            $$('#numeroPersonas').html(data[0]['poblacion'] + '/' + localStorage.limite);
            $$('#textoImagen').html(data[0]['poblacion'] + '/' + localStorage.limite);
            $$('#textoImagenS').html(data[0]['poblacion'] + '/' + localStorage.limite);
            //
            poblacionA = parseInt(data[0]['poblacion']);
        } else {
            //
            $$('#numeroPersonas').html(0 + '/' + localStorage.limite);
            $$('#textoImagen').html(0 + '/' + localStorage.limite);
            $$('#textoImagenS').html(0 + '/' + localStorage.limite);
            //
            poblacionA = 0;
        }
    });
}

//
function cargarSlider() {
    //
    app.request.post(urlServidor + 'Read/cargarSlider', {sector: localStorage.sector, idEmp: localStorage.idUsu}, function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        var campos = '';
        //
        if (data.length > 0) {
            //
            for (var i = 0; i < data.length; i++) {
                //
                var dir = '';
                //
                if (data[i]['url'] !== '') {
                    //
                    dir = 'onclick="abrirNavegador(\'' + data[i]['url'] + '\')"';
                }
                //
                campos += '<div class="swiper-slide"><a ' + dir + '><img class="imgSlider" src="' + urlImagenSlider + data[i]['imagen'] + '"></a></div>';
            }
            //
            $$('#sliderHome').html(campos);
            inicializarSlider();
        } else {
            //
            inicializarSlider();
        }
    });
}

//
function abrirNavegador(url) {
    //
    var ref = window.open(url, '_blank', 'location=yes');
}

//
function inicializarSlider() {
    //
    app.swiper.create('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
//        centeredSlides: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });
}

//
function consultarLimitePersonas() {
    //
    app.request({
        url: urlServidor + 'Read/consultarLimitePersonas',
        data: {idEmp: localStorage.idUsu, idSed: localStorage.idSed},
        method: "POST",
        beforeSend: function () {
            //
        },
        success: function (rsp) {
            //
            var data = JSON.parse(rsp);
            //
            if (data[0].limite > 0) {
                //
                localStorage.limite = data[0].limite;
                //
                $$('#numeroPersonas').html(poblacionA + '/' + localStorage.limite);
            } else {
                //
                limitePersonas();
            }
        },
        error: function (xhr, e) {
            console.log(xhr);
            modal = app.dialog.create({
                title: 'Atención!',
                text: 'Error de conexión!',
                buttons: [{text: 'OK'}]
            }).open();
        }
    });
}

//
function limitePersonas() {
    //
    app.dialog.prompt('Limite de personas en el establecimiento?', 'Atencion!', function (limite) {
        //
        localStorage.limite = limite;
        //
        $$('#numeroPersonas').html(poblacionA + '/' + localStorage.limite);
        //
        app.request({
            url: urlServidor + 'Update/limitePersonas',
            data: {idEmp: localStorage.idUsu, idSed: localStorage.idSed, limite: limite},
            method: "POST",
            beforeSend: function () {
                //
                app.preloader.show();
            },
            success: function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                app.preloader.hide();
                //
                if (data.estado == 'guardado') {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Guardado!',
                        buttons: [{text: 'OK'}]
                    }).open();
                } else {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Error: ' + data.estado,
                        buttons: [{text: 'OK'}]
                    }).open();
                }
            },
            error: function (xhr, e) {
                app.preloader.hide();
                console.log(xhr);
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'Error de conexión!',
                    buttons: [{text: 'OK'}]
                }).open();
            }
        });
    });
    //
    if (localStorage.limite !== '' && localStorage.limite !== undefined) {
        //
        $$('.dialog-input').val(localStorage.limite);
    }
    //
    $$('.dialog-input').focus();
}

//
function generarPdf() {
    //
    app.request({
        url: urlServidor + 'Read/generarPdf',
        data: {idEmp: localStorage.idUsu, idSed: localStorage.idSed},
        method: "POST",
        beforeSend: function () {
            //
            app.preloader.show();
        },
        success: function (rsp) {
            //
            var data = JSON.parse(rsp);
            //
            app.preloader.hide();
            //
            if (data.estado != 'error' && data.estado != 'error2') {
                //
                var ref = window.open(urlReportes + data.estado, '_blank', 'location=yes');
                //
//                let uri = urlReportes + data.estado;
//                let path = 'file:///storage/emulated/0/Download/';
                //
            } else if (data.estado == 'error2') {
                //
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'No hay registros de actividad en los últimos 15 días!',
                    buttons: [{text: 'OK'}]
                }).open();
            } else {
                //
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'Error: ' + data.estado,
                    buttons: [{text: 'OK'}]
                }).open();
            }
        },
        error: function (xhr, e) {
            app.preloader.hide();
            console.log(xhr);
//            alert(JSON.stringify(xhr) + ' _ ' + JSON.stringify(e) + ' ' + $$('#correo').val() + ' - ' + $$('#password').val());
            modal = app.dialog.create({
                title: 'Atención!',
                text: 'Error de conexión!',
                buttons: [{text: 'OK'}]
            }).open();
        }
    });
}

//----------------------------------Perfil--------------------------------------

//
function cargarPerfil() {
    //
    $$('#nombreP').val(localStorage.nombre);
    $$('#nitP').val(localStorage.nit);
    $$('#correoP').val(localStorage.correo);
    $$('#sectorP').val(localStorage.sector);
    $$('#passwordP').val(localStorage.password);
}

//
function editarEmpresa() {
    //
    let control = true;
    //
    if (localStorage.password !== $$('#passwordP').val()) {
        //
        if ($$('#passwordP').val() !== $$('#passwordPC').val()) {
            //
            control = false;
            //
            modal = app.dialog.create({
                title: 'Atención!',
                text: 'Las contraseñas no coinciden!',
                buttons: [{text: 'OK'}]
            }).open();
        }
    }
    //
    if (control) {
        //
        var formElement = document.getElementById("formPerfil");
        formData = new FormData(formElement);
        //
        formData.append('idEmp', localStorage.idUsu);
        formData.append('correoA', localStorage.correo);
        //
        app.request({
            url: urlServidor + 'Update/editarEmpresa',
            data: formData,
            method: "POST",
            beforeSend: function () {
                //
                app.preloader.show();
            },
            success: function (rsp) {
                //
//                var data = JSON.parse(rsp);
                //
                app.preloader.hide();
                //
                if (rsp == 'editado') {
                    //
                    localStorage.nombre = $$('#nombreP').val();
                    localStorage.nit = $$('#nitP').val();
                    localStorage.correo = $$('#correoP').val();
                    localStorage.idCiu = $$('#ciudadP').val();
                    localStorage.idDep = $$('#departamentoP').val();
                    localStorage.sector = $$('#sectorP').val();
                    localStorage.password = $$('#passwordP').val();
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Perfil editado!',
                        buttons: [{text: 'OK'}]
                    }).open();
                    //
                } else if (rsp == 'existe') {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'El correo ingresado ya existe!',
                        buttons: [{text: 'OK'}]
                    }).open();
                } else {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Error al editar!',
                        buttons: [{text: 'OK'}]
                    }).open();
                }
            },
            error: function (xhr, e) {
                app.preloader.hide();
                console.log(xhr);
//            alert(JSON.stringify(xhr) + ' _ ' + JSON.stringify(e) + ' ' + $$('#correo').val() + ' - ' + $$('#password').val());
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'Error de conexión!',
                    buttons: [{text: 'OK'}]
                }).open();
            }
        });
    }
}

//-------------------------------Entrada & Salida-------------------------------

//
function soloNumeros(string) {//Solo numeros
    var out = '';
    var filtro = '1234567890';//Caracteres validos
    //Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
    for (var i = 0; i < string.length; i++)
        //
        if (filtro.indexOf(string.charAt(i)) != -1)
            //Se añaden a la salida los caracteres validos
            out += string.charAt(i);
    //Retornar valor filtrado
    return out;
}

//
var idPer = 0;

//
function traerInfo(valor) {
    //
    let documento = 0;
    //
    if (valor === 1) {
        //
        documento = $$('#documento').val();
    } else {
        //
        documento = $$('#documentoS').val();
    }
    //
    app.request.post(urlServidor + 'Read/traerInfo', {documento: documento}, function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if (data.length > 0) {
            //
            idPer = parseInt(data[0]['idPer']);
            //
            if (valor === 1) {
                //
                $$('#nombres').val(data[0]['nombres']);
                $$('#apellidos').val(data[0]['apellidos']);
                $$('#telefono').val(data[0]['telefono']);
                $$('#direccion').val(data[0]['direccion']);
            } else {
                //
                $$('#nombresS').val(data[0]['nombres']);
                $$('#apellidosS').val(data[0]['apellidos']);
                $$('#telefonoS').val(data[0]['telefono']);
                $$('#direccionS').val(data[0]['direccion']);
            }
        } else {
            //
            idPer = 0;
            //
            if (valor === 1) {
                //
                $$('#nombres').val('');
                $$('#apellidos').val('');
                $$('#telefono').val('');
                $$('#direccion').val('');
            } else {
                //
                $$('#nombresS').val('');
                $$('#apellidosS').val('');
                $$('#telefonoS').val('');
                $$('#direccionS').val('');
            }
        }
    });
}

//
function guardarEntrada() {
    //
    if (poblacionA >= parseInt(localStorage.limite)) {
        //
        modal = app.dialog.create({
            title: 'Atención!',
            text: 'Limite alcanzado!',
            buttons: [{text: 'OK'}]
        }).open();
    } else {
        //
        var formElement = document.getElementById("formEntrada");
        formData = new FormData(formElement);
        //
        formData.append('idPer', idPer);
        formData.append('idEmp', localStorage.idUsu);
        formData.append('idSed', localStorage.idSed);
        //
        app.request({
            url: urlServidor + 'Create/guardarEntrada',
            data: formData,
            method: "POST",
            beforeSend: function () {
                //
                app.preloader.show();
            },
            success: function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                app.preloader.hide();
                //
                if (data.estado == 'registrado') {
                    //
                    idPer = 0;
                    $$('#documento').val('');
                    $$('#nombres').val('');
                    $$('#apellidos').val('');
                    $$('#telefono').val('');
                    $$('#direccion').val('');
                    $$('#temperatura').val('');
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Entro!',
                        buttons: [{text: 'OK'}]
                    }).open();
                    //
                    actualizarPersonas();
                } else if (data.estado == 'dentro') {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'La persona ya entro!',
                        buttons: [{text: 'OK'}]
                    }).open();
                } else {
                    //
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Error: ' + data.estado,
                        buttons: [{text: 'OK'}]
                    }).open();
                }
            },
            error: function (xhr, e) {
                app.preloader.hide();
                console.log(xhr);
//            alert(JSON.stringify(xhr) + ' _ ' + JSON.stringify(e) + ' ' + $$('#correo').val() + ' - ' + $$('#password').val());
                modal = app.dialog.create({
                    title: 'Atención!',
                    text: 'Error de conexión!',
                    buttons: [{text: 'OK'}]
                }).open();
            }
        });
    }
}

//
function guardarSalida() {
    //
    if (poblacionA === 0) {
        //
        modal = app.dialog.create({
            title: 'Atención!',
            text: 'No hay personas para dar salida!',
            buttons: [{text: 'OK'}]
        }).open();
    } else {
        //
        if (idPer > 0) {
            //
//            var formElement = document.getElementById("formSalida");
//            formData = new FormData(formElement);
//            //
//            formData.append('idPer', idPer);
//            formData.append('idEmp', localStorage.idUsu);
//            formData.append('idSed', localStorage.idSed);
            //
            app.request({
                url: urlServidor + 'Update/guardarSalida',
                data: {idPer: idPer, idEmp: localStorage.idUsu, idSed: localStorage.idSed},
                method: "POST",
                beforeSend: function () {
                    //
                    app.preloader.show();
                },
                success: function (rsp) {
                    //
                    var data = JSON.parse(rsp);
                    //
                    app.preloader.hide();
                    //
                    if (data.estado == 'registrado') {
                        //
                        idPer = 0;
                        $$('#documentoS').val('');
                        $$('#nombresS').val('');
                        $$('#apellidosS').val('');
                        $$('#telefonoS').val('');
                        $$('#direccionS').val('');
                        //
                        modal = app.dialog.create({
                            title: 'Atención!',
                            text: 'Salió!',
                            buttons: [{text: 'OK'}]
                        }).open();
                        //
                        actualizarPersonas();
                        //
                    } else if (data.estado == 'no dentro') {
                        //
                        modal = app.dialog.create({
                            title: 'Atención!',
                            text: 'La persona no tiene registro de entrada!',
                            buttons: [{text: 'OK'}]
                        }).open();
                        //
                    } else {
                        //
                        modal = app.dialog.create({
                            title: 'Atención!',
                            text: 'Error: ' + data.estado,
                            buttons: [{text: 'OK'}]
                        }).open();
                    }
                },
                error: function (xhr, e) {
                    app.preloader.hide();
                    console.log(xhr);
//            alert(JSON.stringify(xhr) + ' _ ' + JSON.stringify(e) + ' ' + $$('#correo').val() + ' - ' + $$('#password').val());
                    modal = app.dialog.create({
                        title: 'Atención!',
                        text: 'Error de conexión!',
                        buttons: [{text: 'OK'}]
                    }).open();
                }
            });
        } else {
            //
            modal = app.dialog.create({
                title: 'Atención!',
                text: 'Esta persona no tiene entrada!',
                buttons: [{text: 'OK'}]
            }).open();
        }

    }
}

//------------------------------------------------------------------------------

//
var tipoRegistro = 0;

//
function tomarFoto(valor) {
    //
    tipoRegistro = valor;
    //
    navigator.camera.getPicture(onSuccessC, error, {
        //
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
    });
}

//
function onSuccessC(imageURI) {
    //
    textocr.recText(0, /*3,*/ imageURI, onSuccess, onFail); // removed returnType (here 3) from version 2.0.0
    // for sourceType Use 0,1,2,3 or 4
    // for returnType Use 0,1,2 or 3 // 3 returns duplicates[see table]
    function onSuccess(recognizedText) {
        //Use above two lines to show recognizedText in html
//        alert(JSON.stringify(recognizedText['words']['wordtext']));
        //
        if (tipoRegistro === 2) {
            //
//            $$('#documentoS').val(recognizedText['words']['wordtext'][9]);
//            $$('#nombresS').val(recognizedText['words']['wordtext'][13] + ' ' + recognizedText['words']['wordtext'][14]);
//            $$('#apellidosS').val(recognizedText['words']['wordtext'][10] + ' ' + recognizedText['words']['wordtext'][11]);
            for (var i = 0; i < recognizedText['words']['wordtext'].length; i++) {
                //
                if (recognizedText['words']['wordtext'][i] === 'NUMERO' || recognizedText['words']['wordtext'][i] === 'NUMER0') {
                    //
                    $$('#documentoS').val(recognizedText['words']['wordtext'][i + 1]);
                    $$('#nombresS').val(recognizedText['words']['wordtext'][i + 5] + ' ' + recognizedText['words']['wordtext'][i + 6]);
                    $$('#apellidosS').val(recognizedText['words']['wordtext'][i + 2] + ' ' + recognizedText['words']['wordtext'][i + 3]);
                }
            }
            //
//            sacarPersona();
            $$('#documentoS').val(soloNumeros($$('#documentoS').val()));
            traerInfo(2);
        } else {
            //
//            $$('#documento').val(recognizedText['words']['wordtext'][9]);
//            $$('#nombres').val(recognizedText['words']['wordtext'][13] + ' ' + recognizedText['words']['wordtext'][14]);
//            $$('#apellidos').val(recognizedText['words']['wordtext'][10] + ' ' + recognizedText['words']['wordtext'][11]);
            for (var i = 0; i < recognizedText['words']['wordtext'].length; i++) {
                //
                if (recognizedText['words']['wordtext'][i] === 'NUMERO' || recognizedText['words']['wordtext'][i] === 'NUMER0') {
                    //
                    $$('#documento').val(recognizedText['words']['wordtext'][i + 1]);
                    $$('#nombres').val(recognizedText['words']['wordtext'][i + 5] + ' ' + recognizedText['words']['wordtext'][i + 6]);
                    $$('#apellidos').val(recognizedText['words']['wordtext'][i + 2] + ' ' + recognizedText['words']['wordtext'][i + 3]);
                }
            }
            //
            $$('#documento').val(soloNumeros($$('#documento').val()));
            traerInfo(1);
        }
    }
    //
    function onFail(message) {
        //
        alert('Failed because: ' + JSON.stringify(message));
    }
    //
    if (tipoRegistro === 2) {
        //
        var image = document.getElementById('imgLoginS');
        image.src = imageURI;
    } else {
        //
        var image = document.getElementById('imgLogin');
        image.src = imageURI;
    }
}

//
function error(message) {
    //
    console.log('Failed because: ' + JSON.stringify(message));
}

//
function successS() {
    //
    serial.open({baudRate: 9600}, respuesta, error);
}

//
var temperaturaA = 0;
var controlTemperatura = 0;

//
function respuesta() {
    //
    var errorCallback = function (message) {
        alert('Error: ' + message);
    };
    // register the read callback
    serial.registerReadCallback(
            function success(data) {
                //
                controlTemperatura++;
                // decode the received message
                var view = new Uint8Array(data);
//                var array = view.split(",");
                var str = '';
                var controlC = 0;
                var arrayD = [];
                //
                if (view.length >= 1) {
                    //
                    var i = 0;
                    //
                    while (i < view.length) {
                        // if we received a \n, the message is complete, display it
                        var temp_str = String.fromCharCode(view[i]);
                        var str_esc = escape(temp_str);
                        //
                        if (unescape(str_esc) == '*') {
                            //
                            if (i > 0) {
                                //
                                arrayD[controlC] = {t: str};
                                //
                                controlC++;
                            }
                            //
                            str = '';
                            //
                            i += 2;
                        } else {
                            //
                            if (unescape(str_esc) != '') {
                                //
                                str += unescape(str_esc);
                            }
                            //
                            i++;
                        }
                        //
                        if (i === view.length) {
                            //
                            arrayD[controlC] = {t: str};
                        }
                    }
                }
                //
                if (arrayD.length > 0) {
                    //
                    for (var i = 0; i < arrayD.length; i++) {
                        //
                        if (parseFloat(arrayD[i]['t']) > 35) {
                            //
                            if (parseFloat(arrayD[i]['t']) > temperaturaA) {
                                //
                                app.preloader.show();
                                //
                                temperaturaA = parseFloat(arrayD[i]['t']);
                                //
                                $$('#temperatura').val(temperaturaA);
                                //
                                if (temperaturaA < 37.7) {
                                    //
                                    document.getElementById("temperatura").style.border = "1px solid green";
                                    document.getElementById("temperatura").style.color = "white";
                                    document.getElementById("temperatura").style.background = "green";
                                    //
                                } else if (temperaturaA > 37.6 && temperaturaA < 37.9) {
                                    //
                                    document.getElementById("temperatura").style.border = "1px solid orange";
                                    document.getElementById("temperatura").style.color = "white";
                                    document.getElementById("temperatura").style.background = "orange";
                                    //
                                } else {
                                    //
                                    document.getElementById("temperatura").style.border = "1px solid red";
                                    document.getElementById("temperatura").style.color = "white";
                                    document.getElementById("temperatura").style.background = "red";
                                }
                            }
                        } else if (parseFloat(arrayD[i]['t']) < 35 && temperaturaA > 0 && controlTemperatura >= 5) {
                            //
//                            guardarDatos(tipoRegistro);
                        }
                    }
                }
            }, errorCallback // error attaching the callback
            );
}

//
function sacarPersona() {
    //
    if (arrayRegistro.length > 0) {
        //
        for (var i = 0; i < arrayRegistro.length; i++) {
            //
            if (arrayRegistro[i]['documento'] == $$('#documentoS').val()) {
                //
                arrayRegistro.splice(i, 1);
                //
                $$('#textoImagenS').html(arrayRegistro.length + '/100');
                //
                var toast = app.toast.create({
                    text: 'Registro retirado!',
                    closeTimeout: 5000
                });
                //
                toast.open();
            }
        }
    }
}