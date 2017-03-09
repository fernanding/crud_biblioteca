/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint
$.libro={};
// Configuración del HOST y URL del servicio
$.libro.HOST = 'http://localhost:8080';
// $.libro.URL = '/GA-JPA/webresources/com.iesvdc.acceso.entidades.libro';
$.libro.URL = '/G_BIBLIOTECA_JPA/webresources/com.iesvdc.acceso.entidades.libro';

$.libro.LibroReadREST = function(id) {
    if ( id === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#r_libro').empty();
                $('#r_libro').append('<h3>Listado de Libros</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>Titulo</th>', '<th>ISBN</th>', '<th>Autor</th>', '<th>FechaPrestamo</th>', '<th>FechaDevolucion</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    tbody.append($('<tr />').append('<td>' + json[clave].id + '</td>',
                                '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].codigoISBN + '</td>', '<td>' + json[clave].autor + '</td>','<td>' + new Date (json[clave].fechaPrestamo).toDateString() + '</td>','<td>' +  new Date (json[clave].fechaDevolucion).toDateString() + '</td>'));
                }
                table.append(tbody);
                console.log(json[0]);
                $('#r_libro').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $('#r_libro').empty();
                $('#r_libro').append('<h3>Error conectando al servidor</h3>');
                $('#r_libro').append('<p>Inténtelo más tarde</p>');
            }
        });
    } else {
        $.ajax({
            url: 'http://localhost:8080/G_BIBLIOTECA_JPA/webresources/com.iesvdc.acceso.entidades.libro',
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                
            },
            error: function (xhr, status) {
                this.error('Imposible leer libro','Compruebe su conexión e inténtelo de nuevo más tarde');
            }
        });
    }
    
};

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
$.libro.LibroCreateREST = function(){
       var datos = { 
           'autor': $("#c_li_autor").val(), 'codigoISBN':$("#c_li_CodIsbn").val(),
'fechaDevolucion':$('#c_li_FechaDevol').val()+"T00:00:00+02:00", 
'fechaPrestamo': $('#c_li_FechaPrestamo').val()+"T00:00:00+02:00", 'nombre':$("#c_li_nombre").val()
                  };
    $('#c_li_FechaPrestamo').val(new Date().toDateInputValue());
     $('#c_li_FechaDevol').val(new Date().toDateInputValue()); 
    // comprobamos que en el formulario haya datos...
    if ( datos.nombre.length>2 && datos.codigoISBN.length>2) {
        
        $.ajax({
            url: $.libro.HOST+$.libro.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.libro.LibroReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Libro Create','No ha sido posible crear el libro. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
       
        // cargamos el panel con id r_libro.
        $.afui.loadContent("#r_libro",false,false,"up");
    }
    
};

$.libro.LibroDeleteREST = function(id){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( id !== undefined ) {
        id = $('#d_li_sel').val();
        $.ajax({
            url: $.libro.HOST+$.libro.URL+'/'+id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.libro.LibroReadREST();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_libro.
                $.afui.loadContent("#r_libro",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Libro Delete','No ha sido posible borrar el libro. Compruebe su conexión.');
            }
        });    
    } else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_libro').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var select = $('<select id="d_li_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].nombre+' ' + json[clave].codigoISBN+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="btn btn-danger" onclick="$.libro.LibroDeleteREST(1)"> eliminar! </div>');
                $('#d_libro').append(formulario).append(select);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Cliente Delete','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
    
};

$.libro.LibroUpdateREST = function(id, envio){
    if ( id === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_libro').empty();
                $('#u_libro').append('<h3>Pulse sobre un libro</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>Titulo</th>', '<th>ISBN</th>', '<th>Autor</th>','<th>Fecha Prestamo</th>','<th>Fecha Devolucion</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.libro.LibroUpdateREST('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>',
                    '<td>' + json[clave].nombre + '</td>','<td>' + json[clave].codigoISBN + '</td>', '<td>' + json[clave].autor + '</td>','<td>' + new Date (json[clave].fechaPrestamo).toDateString() + '</td>','<td>' +  new Date (json[clave].fechaDevolucion).toDateString() + '</td>'));
                }
                table.append(tbody);

                $('#u_libro').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.libro.error('Error: Cliente Update','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        var seleccion = "#fila_"+id+" td";
        var li_id = ($(seleccion))[0];
        var li_nombre = ($(seleccion))[1];
        var li_codigoISBN = ($(seleccion))[2];
        var li_autor = ($(seleccion))[3];
         var li_fechaPrestamo = ($(seleccion))[4];
         var li_fechaDevol = ($(seleccion))[5];
        
        
        $("#u_li_id").val(li_id.childNodes[0].data);
        $("#u_li_nombre").val(li_nombre.childNodes[0].data);
        $("#u_li_codigoISBN").val(li_codigoISBN.childNodes[0].data);
        $("#u_li_autor").val(li_autor.childNodes[0].data);
        $("#u_li_fechaPrestamo").val(li_fechaPrestamo.childNodes[0].data);
        $("#u_li_fechaDevolucion").val(li_fechaDevol.childNodes[0].data);
       $('#u_li_fechaPrestamo').val(new Date().toDateInputValue());
     $('#u_li_fechaDevolucion').val(new Date().toDateInputValue()); 
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_libro.
        $.afui.loadContent("#uf_libro",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
 'autor': $("#u_li_autor").val(), 'codigoISBN':$("#u_li_codigoISBN").val(),
'fechaDevolucion':$('#u_li_fechaDevolucion').val()+"T00:00:00+02:00", 
'fechaPrestamo': $('#u_li_fechaPrestamo').val()+"T00:00:00+02:00",
'id' : $("#u_li_id").val(),
'nombre':$("#u_li_nombre").val()
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.nombre.length>2 && datos.codigoISBN.length>2 && datos.autor.length>2) {
  
                $.ajax({
                    url: $.libro.HOST+$.libro.URL+'/'+$("#u_li_id").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.libro.LibroReadREST();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.libro.error('Error: Libro Create','No ha sido posible crear el libro. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_libro.
                $.afui.loadContent("#r_libro",false,false,"up");
            }
    }
};

$.libro.error = function(title, msg){
    $('#err_libro').empty();
    $('#err_libro').append('<h3>'+title+'</h3>');
    $('#err_libro').append('<p>'+msg+'</p>');
    // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
    $.afui.clearHistory();
    // cargamos el panel con id r_libro.
    $.afui.loadContent("#err_libro",false,false,"up");
};
