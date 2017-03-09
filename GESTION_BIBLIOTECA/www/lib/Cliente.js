/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint
$.cliente={};
// Configuración del HOST y URL del servicio
$.cliente.HOST = 'http://localhost:8080';
// $.cliente.URL = '/GA-JPA/webresources/com.iesvdc.acceso.entidades.cliente';
$.cliente.URL = '/G_BIBLIOTECA_JPA/webresources/com.iesvdc.acceso.entidades.cliente';

$.cliente.ClienteReadREST = function(id) {
    if ( id === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#r_cliente').empty();
                $('#r_cliente').append('<h3>Listado de Clientes</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>apellido</th>', '<th>direccion</th>', '<th>email</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    tbody.append($('<tr />').append('<td>' + json[clave].id + '</td>',
                                '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellido + '</td>', '<td>' + json[clave].direccion + '</td>', '<td>' + json[clave].email + '</td>'));
                }
                table.append(tbody);

                $('#r_cliente').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $('#r_cliente').empty();
                $('#r_cliente').append('<h3>Error conectando al servidor</h3>');
                $('#r_cliente').append('<p>Inténtelo más tarde</p>');
            }
        });
    } else {
        $.ajax({
            url: 'http://localhost:8080/G_BIBLIOTECA_JPA/webresources/com.iesvdc.acceso.entidades.cliente',
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                
            },
            error: function (xhr, status) {
                this.error('Imposible leer cliente','Compruebe su conexión e inténtelo de nuevo más tarde');
            }
        });
    }
};

$.cliente.ClienteCreateREST = function(){
    var datos = {
        'nombre' : $("#c_al_nombre").val(),
        'apellido': $("#c_al_apellido").val(),
        'direccion': $("#c_al_direccion").val(),
        'email': $("#c_al_email").val()
    };
    
    // comprobamos que en el formulario haya datos...
    if ( datos.nombre.length>2 && datos.apellido.length>2 && datos.direccion.length>2 && datos.email.length>2) {
        $.ajax({
            url: $.cliente.HOST+$.cliente.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.cliente.ClienteReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Cliente Create','No ha sido posible crear el cliente. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_cliente.
        $.afui.loadContent("#r_cliente",false,false,"up");
    }
    
};

$.cliente.ClienteDeleteREST = function(id){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( id !== undefined ) {
        id = $('#d_al_sel').val();
        $.ajax({
            url: $.cliente.HOST+$.cliente.URL+'/'+id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.cliente.ClienteReadREST();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_cliente.
                $.afui.loadContent("#r_cliente",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Cliente Delete','No ha sido posible borrar el cliente. Compruebe su conexión.');
            }
        });    
    } else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_cliente').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var select = $('<select id="d_al_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].nombre+' ' + json[clave].apellido+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="btn btn-danger" onclick="$.cliente.ClienteDeleteREST(1)"> eliminar! </div>');
                $('#d_cliente').append(formulario).append(select);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Cliente Delete','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
    
};

$.cliente.ClienteUpdateREST = function(id, envio){
    if ( id === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_cliente').empty();
                $('#u_cliente').append('<h3>Pulse sobre un cliente</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>apellidos</th>', '<th>direccion</th>', '<th>email</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.cliente.ClienteUpdateREST('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>',
                    '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellido + '</td>', '<td>' + json[clave].direccion + '</td>', '<td>' + json[clave].email + '</td>'));
                }
                table.append(tbody);

                $('#u_cliente').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.cliente.error('Error: Cliente Update','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        var seleccion = "#fila_"+id+" td";
        var al_id = ($(seleccion))[0];
        var al_nombre = ($(seleccion))[1];
        var al_apellidos = ($(seleccion))[2];
        var al_direccion = ($(seleccion))[3];
         var al_email = ($(seleccion))[4];
        
        $("#u_al_id").val(al_id.childNodes[0].data);
        $("#u_al_nombre").val(al_nombre.childNodes[0].data);
        $("#u_al_apellidos").val(al_apellidos.childNodes[0].data);
        $("#u_al_direccion").val(al_direccion.childNodes[0].data);
        $("#u_al_email").val(al_email.childNodes[0].data);
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_cliente.
        $.afui.loadContent("#uf_cliente",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
                'id' : $("#u_al_id").val(),
                'nombre' : $("#u_al_nombre").val(),
                'apellido': $("#u_al_apellidos").val(),
                'direccion': $("#u_al_direccion").val(),
                'email': $("#u_al_email").val()
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.nombre.length>2 && datos.apellido.length>2 && datos.direccion.length>2 && datos.email.length>2 ) {
                $.ajax({
                    url: $.cliente.HOST+$.cliente.URL+'/'+$("#u_al_id").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.cliente.ClienteReadREST();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.cliente.error('Error: Cliente Create','No ha sido posible crear el cliente. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_cliente.
                $.afui.loadContent("#r_cliente",false,false,"up");
            }
    }
};

$.cliente.error = function(title, msg){
    $('#err_cliente').empty();
    $('#err_cliente').append('<h3>'+title+'</h3>');
    $('#err_cliente').append('<p>'+msg+'</p>');
    // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
    $.afui.clearHistory();
    // cargamos el panel con id r_cliente.
    $.afui.loadContent("#err_cliente",false,false,"up");
};
