function ControlWeb() {

    this.mostrarAgregarUsuario=function() {
        $('#bnv').remove();
        $('#mAU').remove();
        let cadena = '<div id="mAU">';
        cadena = cadena + '<div class="card"><div class="card-body">';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<label for="nick">Nick:</label>';
        cadena = cadena + '<p><input type="text" class="form-control" id="nick" placeholder="introduce unnick"></p>';
        cadena = cadena + '<button id="btnAU" type="submit" class="btn btn-primary">Submit</button>';
        cadena = cadena + '<div><a href="/auth/google"><img src="./c/img/btn_google_signin_light_focus_web@2x.png" style="height:40px;"></a></div>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div></div></div>';
    }

    this.comprobarSesion=function(){
        let nick= $.cookie("nick");
        if (nick){
            cw.mostrarMensaje("Bienvenido al sistema, "+nick);
        }
        else{
            cw.mostrarRegistro();
        }
    }
    this.mostrarRegistro=function(){
        if ($.cookie('nick')){
            return true;
        };
        $("#fmRegistro").remove();
        $("#registro").load("./c/registro.html",function(){
            $("#btnRegistro").on("click",function(){
                let email=$("#email").val();
                let pwd=$("#pwd").val();
                if (email && pwd){
                    console.log("Email: " + email + " Password: " + pwd)
                    rest.registrarUsuario(email,pwd);

                }
            });
        });
    }
    this.salir=function(){
        $.removeCookie("nick");
        location.reload();
        console.log("Hemos salido");
    }
}
