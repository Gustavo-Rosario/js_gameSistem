//Classe de notificação
var Notas = function(){
	this.mensagem = function(titulo, corpo, tipo){
        if(Notification.permission === "granted"){
            var num = parseInt($("#userName").attr("class")) + 1;
            var notification = new Notification(titulo, {
                dir: "auto",
                icon: "../users/img/avatar0"+num+".png",
                lang: "",
                duration: 5,
                body: corpo,
                tag: tipo,
                });
    	}else{
            Notification.requestPermission().then(function(resp){
                if(resp === "granted"){
                    var notification = new Notification(titulo, {
                        dir: "auto",
                        icon: "..//users/img/avatar0"+num+".png",
                        lang: "",
                        duration: 5,
                        body: corpo,
                        tag: tipo,
                    }); 
                }else{
                    console.log(resp);
                }
            });
    	 }
	};
}

//Pre carregar imagens
function preImg(vetor){
    vetor.forEach(function(e){
        $("#preImg").attr("src", e);
    });
    $("#preImg").attr("src", "");
}

$(main);

function main() {
    
    //Teste de carregamento de opcoes a partir de arquivo json
    $.getJSON("/Desktop/img/.wallpaper.json", function(data) {
            data.wall.forEach(function(e, i) {
                $("#liImagem").append("<li onclick='changeWall(this)' id='"+e.nome+"' style='background-image: url(img/"+e.img+")'></li>");
                
            });
        })
        .done(function() {
            //Em caso de sucesso 
            console.log("Great - ImageList");
        })
        .fail(function() {
            //Em caso de erro
            console.log("Fail - ImageList");;
        });
    
// Uso de um plugin disponível no site https://jqueryui.com/draggable/
    // Basta adicionar ".draggable()" para o determinado elemento
    $("#miniPlay").draggable();
    
// Esconde as divs #offMode, #miniplay, .wr, .opConfig  
    $("#offMode, #miniplay, .wr, .opConfig").hide();
        
//Função pra iniciar pegandondo usuario no JSON
    init();
//Pega data e hora
    hrdt();
    
// Área de menu lateral - SlideToggle nas opções de menu
    $("#allConfig section h2").click(function() {
        $(this).next().slideToggle();
    });
    
// Ao clicar no botão de configurações, mover ao menu para disponibilizar a visão
    $("#config").click(function() {
        var all = $("#allConfig");
        if (all.css("left") != "0px") {
            all.css("left", "0px");
            $(this).css("opacity", "1");
        } else {
            all.css("left", "-290px");
            $(this).css("opacity", ".4");
        }
    }); 
    
// Alterar o plano de fundo do Desktop
    $("#allConfig #liImagem li").click(function() {
        $("#allConfig #liImagem li").css("border", "1px solid grey");
        $(this).css("border", "1px solid blue");
        $("#bgFoto").css("background-image", $(this).css("background-image")).fadeIn();
    //Atribui um valor ao alt do id preImg para funções posteriores
        $("#preImg").attr("alt","1");
        $(".bg").fadeOut();
    });
    
// Alterar o vídeo de fundo do Desktop
    $("#allConfig #liVideo li").click(function() {
        $("#allConfig #liVideo li").css("border", "1px solid grey");
        $(this).css("border", "1px solid blue");
        $("#bgFoto").fadeOut();
        var video = $(this).attr("id");
        $(".bg").attr("src", "img/" + video + ".mp4");
    // Atribui um valor ao alt do id preImg para funções posteriores
        $("#preImg").attr("alt","2");
        $(".bg").fadeIn();
        $("#bgVideo").css("background-image","none");
    });
    
// "Desligar"(Stand-by) o sistema e minimizar todas as janelas ativas
    $("#off").click(function() {
        $("#offMode").fadeIn("slow");
        $(".wr").fadeOut();
        //Cria abas minimizadas para as janelas nao minimizadas
        [].slice.call($(".wr")).forEach(function(e){
                var num = parseInt($(e).attr("id").split("n")[1]);
                if(!($("#areaMini .jan"+num).length)){
                    minimizar(num); 
                    //Pausa musica caso esta esteja aberta
                    if(num == 4){document.getElementById("song").pause();}
                }
        });
    });
    
// Trocar usuário
    $("#home").click(function(){
       $("#changeUser").fadeIn();
       $(".wr").fadeOut();
    });

// Religar o sistema
    $("#on").click(function() {
        var num = parseInt($(".userAtivo").attr("id"));
        getUser(num);
        $("#offMode").fadeOut("slow");
    });

// Escolher o usuário
    $("#escolher").click(function(){
        if($(".userAtivo").length){
            var num = parseInt($(".userAtivo").attr("id"));
            getUser(num);
            $("#offMode").fadeOut("slow");
            $("#divs").html(" ");
            $("#miniPlay").hide();
            $("#areaMini ul").html(" ");
            $("#bgTemp").css("background-image","");
            $(".bg").fadeIn("slow");
            $("#changeUser").hide();
        }else{
            $(this).notify("Escolha um usuario para continuar","warn");
        }
    });
    
// Alterar cor de ícone
    $("#alterarIcon").click(function() {
        var icon = $("#corIcone").val();
        $("nav li, #config").css("background-color", icon);
    });
    
// Alterar cor de fundo
    $("#alterarFundo").click(function() {
        var fundo = $("#corFundo").val();
        if (fundo == "#ffffff") {
            ($("#allConfig").css("color", "black"));
        } else {
            ($("#allConfig").css("color", "white"));
        }
        $("#allConfig").css("background-color", fundo);
    });

// Resetar cores de fundo e ícone, além de background
    $("#reset").click(function() {
        $("#allConfig").css({"background-color":"purple","color":"#fff"});
        $("nav li, #config").css("background-color", "#fff");
        $("#bgVideo").css("background-image","none");
        $(".bg").show().attr('src','img/aurora.mp4')[0].load();
        $("#bgFoto").fadeOut();
        $("#preImg").attr("alt","2");
    });
    
// Salva informações atuais do usuario em um JSON
    $("#salvar").click(function(){
        //Pega as informações atuais
        var userID = parseInt($("#userName").attr("class"));
        var coricon = $("nav li, #config").css("background-color");
        var corfundo = $("#allConfig").css("background-color");
        var tipo = parseInt($("#preImg").attr("alt"));
        //Verifica
        var wall = (tipo == 1)? $("#bgFoto").css("background-image").split("/")[5].split('"')[0] 
        :
        $(".bg").attr("src").split("/")[1];
        $.ajax({
            url: "/Desktop/users/info.php",
            method: "POST",
            dataType: "json",
            data: {"userID": userID, "corIcone": coricon, "corFundo" : corfundo, "wall": wall, "tipo" : tipo},
            success : function(data){
                if(data.success =="true"){
                    var nota = new Notas();
                    nota.mensagem("Configurações","As alterações foram salvas com sucesso","config");
                }
            }
        }).fail(function(){
            var nota = new Notas();
            nota.mensagem("Configurações","Erro ao salvar, tente novamente","config");
        })
        .always(function() {
            console.log("AlterConfig");
        });
    });
        
// Como um "hover" do menu
    $("nav li").mouseover(function() {
        $(this).css("opacity","1");
        $(this).mouseleave(function() {
            $(this).css("opacity",".4");
        });
    });

// Ajax referenciando a página view ao conteúdo da div
    $("nav li:not(#off, #home)").click(function() { 
        var menu = parseInt($(this).attr("class"));
        z("#divs ."+menu);
        if($("#divs .win"+menu).length){
            //Mensagem notificando o user que a janela ja está aberta
            $(this).notify("Essa janela já está aberta", {position: "top", className:"info"});
        }else{
            var path = "/Desktop/views/" + menu + ".html";
            $.ajax({
                    url: path,
                    headers:{
                         'Access-Control-Allow-Origin'   : '*',
                         'Accept'                        : 'application/json',
                         'Content-Type'                  : 'application/json',
                     },
                     beforeSend: function(xhrObj){
                         xhrObj.setRequestHeader("Access-Control-Allow-Origin","*");
                         xhrObj.setRequestHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
                         xhrObj.setRequestHeader("Access-Control-Allow-Headers","Content-Type");
                         xhrObj.setRequestHeader("Content-Type","application/json");
                         xhrObj.setRequestHeader("Accept","application/json");
                     },
                    success: (function(data) {
                        $("#divs").append('<div id="jan' + menu + '" onclick="z(this)"  class="wr win' + menu + '"><div class="menuSuperior"><ul><li onclick="minimizar(' + menu + ')" class="mini">-</li><li onclick="fechar(' + menu + ')" class="x">x</li></ul></div><div id="cont">' + data + '</div></div>');
                        $(".wr").fadeIn();
                        $("#divs .win" + menu).draggable();
                        switch (menu) {
                            case 2:
                                $("#divs .win" + menu+" .menuSuperior").append("<span>Imagens</span>");    
                                break;
                            case 3:
                                $("#divs .win" + menu+" .menuSuperior").append("<span>Vídeos</span>");
                                preImg(["/Desktop/img/marioPoster.jpg",
                                        "/Desktop/img/zeldaPoster.jpg",
                                        "/Desktop/img/dkPoster.jpg",
                                        "/Desktop/img/metroidPoster.jpg"
                                        ]);
                                getVideo(0);
                                videoList();
                                break;
                            case 4:
                                $("#divs .win" + menu+" .menuSuperior").append("<span>Músicas</span>");
                                song();
                                musicList();
                                break;
                            case 5:
                                $("#divs .win" + menu+" .menuSuperior").append("<span>Games</span>");
                                gameList();
                                mgInfo(0);
                                break;
                        }
                    })
                })
                .done(function() {
                    console.log("Great - Ajax");
                })
                .fail(function() {
                    console.log("Fail - Ajax");
                });
        }
    });
}

// Função para pegar horário
function hrdt() {
    var hj = new Date();
    var m = hj.getMinutes();
    m = (m < 10) ? "0" + m : m;
    var h = hj.getHours();
    h = (h < 10) ? "0" + h : h;
    var d = hj.getDate();
    var mes = (hj.getMonth() + 1);
    var ano = hj.getFullYear();

    // Atribuir horário ao texto
    $("#date p span").eq(1).html(h + "h" + m);
    $("#date p span").eq(2).html(d + "/" + mes + "/" + ano);
}
setInterval(hrdt, 1000);

// Fecha a janela
function fechar(num) {
    //Caso específico - Games
    if(num == 5){ $("#bgTemp").css("background-image","");  $(".bg").fadeIn("slow"); }
    $("#divs .win"+num).remove();
}

// Minimiza a janela
function minimizar(num){
    //Casos específicos
    //Videos
    if(num == 3){document.getElementById("video").pause();}
    //Musica
    if(num == 4){ $("#miniPlay").fadeIn(); }
    //Games
    if(num == 5){ 
        $("#bgTemp").css("visibility","hidden");
        if($("#vidInfo").length){
            document.getElementById("vidInfo").pause();
        }
    }
    var nome = $("#divs .win" + num+" .menuSuperior span").html();
    $("#divs .win"+num).addClass("minJanela").fadeOut();
    $("#areaMini ul").append("<li onclick='abrir(this,"+num+")' class='nmJanela jan"+num+"'>"+nome+"</li>")
}

//Muda z-index das Janelas quando clicada, dando desfoque nas demais
function z(obj) {
    $(".wr").not(obj).not(".minJanela").addClass("desfocada");
    $(obj).removeClass("desfocada");
}

//Abre uma janela minimizada
function abrir(obj,num){
    $("#divs .win"+num).removeClass("minJanela").fadeIn();
    //Casos específicos
    //Videos
    if(num == 3){document.getElementById("video").play();}
    //Musica
    if(num == 4){ $("#miniPlay").hide(); }
    //Games
    if(num == 5){ 
        $("#bgTemp").css("visibility","visible"); 
        if($("#vidInfo").length){
            document.getElementById("vidInfo").play();
        }
    }
    $(obj).remove();
}

//------------------------------------------------------------VIDEO------------------------------------------------------------------------------//
//Cria lista de videos
function videoList() {
    //Se a janela de musica estiver aberta pausa a musica quando o video for iniciado
    document.getElementById("video").onplay = function(){
        if($("#divs .win4").length){document.getElementById("song").pause();}
    };
    //Adiciona o botão Mais vídeos
    $("#divs .win3 #wrapperNav ").append("<button id='morevideos' onclick='showvideos()'>Mais videos</div>");
    //Pega as informações dos videos
    $.getJSON("/Desktop/videos/video.json", function(data) {
            data.v.forEach(function(e, i) {
                $("#listVid").append("<li onclick='pVid(this)' class='" + i + "'>" + e.nome + "</li>");
            });
        })
        .done(function() {
            //Em caso de sucesso 
            console.log("Great - VideoList");
        })
        .fail(function() {
            //Em caso de erro
            console.log("Fail - VideoList");;
        });
}

//Pega as informações de um vídeos específico
function getVideo(i) {
    var aux;
    $.getJSON("/Desktop/videos/video.json", function(data) {
            $("#divs .win3 .menuSuperior span").html("Vídeos - "+data.v[i].nome);
            $("#video").attr("poster", "img/" + data.v[i].poster);
            $("#video").find("source").attr("src", "videos/" + data.v[i].src);
            $("#video").load();
            $("#morevideos").html("Mais jogos");
            $("#listVid").fadeOut();
        })
        .done(function() {
            //Em caso de sucesso
            console.log("Great - Video");
        })
        .fail(function() {
            //Em caso de falha
            console.log("Fail - Video");;
        });
}

//Inicia um video
function pVid(obj) {
    var num = parseInt($(obj).attr("class"));
    getVideo(num);
}

//Play/Pause de Vídeo
function ppVid() {
    var aux = document.getElementById("video");
    if (aux.paused == true) {
        document.getElementById("video").play();
        if($("#divs .win4").length){document.getElementById("song").pause();}
    } else {
        document.getElementById("video").pause();
    }
}

//Mostra/Esconde Lista de Videos
function showvideos(){
    $("#listVid").fadeIn();
    $("#morevideos").html("Esconder lista");
    var videos = document.getElementById("morevideos");
    //Muda o onclick da função
    videos.onclick =function(){
        $(this).html("Mais vídeos");
        $("#listVid").fadeOut();
        //Volta para a função original
        videos.onclick = function(){
            return showvideos();  
        };
    };
}


//-----------------------------------------------------------------------SONGS---------------------------------------------------------------------//
//Play/Pause de Musica
function playpa(obj) {
    var aux = document.getElementById("song");
    if (aux.paused == true) {
        document.getElementById("song").play();
        //Muda icone no #miniPlay
        $("#playpa").css("background-image","url(img/player5.png)");
    } else {
        document.getElementById("song").pause();
        //Muda icone no #miniPlay
        $("#playpa").css("background-image","url(img/player3.png)");
    }
}

//Musica anterior
function antm() {
    var num = parseInt((document.getElementById("song").currentSrc).split("/")[5].split(".")[0]);
    num = (num <= 1) ? 3 : num - 2;
    getMusic(num);
}

//Musica posterior
function proxm() {
    var num = parseInt((document.getElementById("song").currentSrc).split("/")[5].split(".")[0]);
    num = (num >= 4) ? 0 : num;
    getMusic(num);
}

//Expandir janela de musica pelo #miniPlay
function expa() {
    $("#miniPlay").hide();
    $("#divs .win4").removeClass("minJanela").fadeIn();
    $("#areaMini .jan4").remove();
}

//Adiciona eventos ao player de musica
function song() {
    //Ao terminar uma musica passa para a proxima
    document.getElementById("song").onended = function() {
        var num = parseInt((document.getElementById("song").currentSrc).split("/")[5].split(".")[0]);
        num = (num >= 4) ? 0 : num;
        getMusic(num);
    };
    //Ao tocar uma musica altera o icone do #miniPlay e se a janela de videos estiver aberta o video é pausado
    document.getElementById("song").onplay = function() {
        $("#playpa").css("background-image","url(img/player5.png)");
        if($("#divs .win3").length){document.getElementById("video").pause();}
    };
    //Ao pausar uma musica altera o icone do #miniPlay 
    document.getElementById("song").onpause = function() {
        $("#playpa").css("background-image","url(img/player3.png)");
    };
}

//Cria lista de videos
function musicList() {
    $.getJSON("/Desktop/songs/song.json", function(data) {
            data.m.forEach(function(e, i) {
                $("#mlist").append("<li class='eachSong' onclick='pSong("+i+")' class='" + i + "'>" + e.nome + "<br>"+e.artista+"</li>");
            });
        })
        .done(function() {
            //Em caso de sucesso
            console.log("Great - SongList");
        })
        .fail(function() {
            //Em caso de erro
            console.log("Fail - SongList");;
        });
}

//Pausa a musica atual e toca a selecionada
function pSong(num) {
    document.getElementById("song").pause();
    getMusic(num);
}

//Pega as informações de uma musica
function getMusic(n) {
    $.getJSON("/Desktop/songs/song.json", function(data) {
            $("#song").find("source").attr("src", "songs/" + data.m[n].src);
            $("#nome").html(data.m[n].nome);
            $("#artista").html(data.m[n].artista);
            $("#songImg img").attr("src","img/capas/"+data.m[n].capa);
            if($("#miniPlay").css("display") != "none"){
                //Caso a janela de Musicas esteja fechada uma notificação é mostrada com a musica atual
                var nota = new Notas();
                nota.mensagem("Song Player", "Tocando agora: "+data.m[n].nome + "\n Artista: "+data.m[n].artista,"song");
            }
        })
        .done(function() {
            //Recarrega a tag de audio
            $("#song").load();
            //Toca a musica selecionada pegando algum tipo de erro
            document.getElementById("song").play().catch(function(e) {
                //Do nothing
            });
        });
}

//----------------------------------------------------------------GAMES--------------------------------------------------------------------------//
//Cria lista de games
function gameList() {
    //Adiciona o botão Mais Jogos
    $("#divs .win5 #wrapperNav").append("<button id='moregames' onclick='showgames()'>Mais jogos</div>");
    $.getJSON("/Desktop/games/game.json", function(data) {
            data.g.forEach(function(e, i) {
                $("#listGame").append("<section class='eachGame'><img onclick='mgInfo("+i+")' src='img/game" + i + ".jpg' width='100%'></section>");
            });
        })
        .done(function() {
            //Em caso de sucesso
            console.log("Great - GameList");
        })
        .fail(function() {
            //Em caso de erro
            console.log("Fail - GameList");
        });
}

//Inicia um jogo
function pGame(obj) {
    var n = parseInt($(obj).attr("class"));
    getGame(n);
}

//Faz uma requisição para pegar o jogo desejado
function getGame(n){
    $.getJSON("/Desktop/games/game.json", function(data) {
            $("#mudar").html("<iframe id='igame' src='/Desktop/games/gba/launcher.html#" + data.g[n].src+"' ></iframe>");
        })
        .done(function() {
            //Em caso de sucesso
            console.log("Great - Gameplay");
        })
        .fail(function() {
            //Em caso de erro
            console.log("Fail - Gameplay");
        });
}

//Pega as informações de um jogo em específico e as mostra
function mgInfo(num){
    $.getJSON("/Desktop/games/game.json", function(data) {
            $("#mudar").html('<figure id="icon"><img src="img/'+data.g[num].icon+'"><figcaption><button onclick="getGame('+num+')">PLAY</button></figcaption></figure><video onplay="pOutros()" id="vidInfo" autoplay loop sound="0.2"><source src="videos/'+data.g[num].fundo+'" type="video/mp4"></video>');
            $("#divs .win5 .menuSuperior span").html("Games - "+data.g[num].nome);
            $("#bgTemp").css("background-image","url(img/"+data.g[num].wall+")");
        });
        $("#moregames").html("Mais jogos");
        $("#listGame").fadeOut();
        $(".bg").hide();
}

//Pausa video e musica caso estejam abertos
function pOutros(){
    if($("#divs .win3").length){document.getElementById("video").pause();}
    if($("#divs .win4").length){document.getElementById("song").pause();}
}

//Mostra/Esconde Lista de Games
function showgames(){
    $("#listGame").fadeIn();
    $("#moregames").html("Esconder lista");
    var games = document.getElementById("moregames");
    //Muda o onclick da função
    games.onclick = function(){
        $(this).html("Mais jogos");
        $("#listGame").fadeOut();
        //Volta para a função original
        games.onclick = function(){
            return showgames();  
        };
    };
}

//-----------------------------------------------------------------USERS--------------------------------------------------------------------------//
//Mostar os usuario disponíveis
function init(){
    $.getJSON("/Desktop/users/info.json",function(data) {
        data.forEach(function(e,i){
            $("#areaUser").append("<figure onclick='ativaUser(this)' id='"+i+"'><img src='/Desktop/users/img/"+e.avatar+"'><figcaption>"+e.nome+"</figcaption></figure>");
        });
    });
}
//Deixa um usuario selecionado
function ativaUser(obj){
    $("#areaUser figure").not("#"+obj.id).removeClass("userAtivo");
    $(obj).addClass("userAtivo");
}

//Pega informações do usuario selecionado e as coloca no site
function getUser(num){
    $.getJSON("/Desktop/users/info.json",function(data){
        $("#userName").html(data[num].nome).attr("class",num);
        $("nav li, #config").css("background-color", data[num].coricone);
        $("#allConfig").css("background-color", data[num].corfundo);
        $("#preImg").attr("alt",data[num].tipo);
        if(data[num].tipo == 1){
            $("#bgFoto").css("background-image", "url(/Desktop/img/"+data[num].wall+")").fadeIn("slow");
            $(".bg").fadeOut();
        }else{
            $(".bg").attr("src","img/"+data[num].wall);
            $(".bg").fadeIn();
            $("#bgFoto").fadeOut("slow");
        }
    });
}

//--------------------------------------------------------------------IMAGENS------------------------------------------------------------------//
// Mostra/Esconda imagens da biblioteca
function aumentarImagem(obj){
    $("#areaFoto").fadeIn();
    var img = $(obj).attr("src");
    $("#Image").css("background-image","url(" + img + ")") ;
    $("#areaFoto").click(function(){
       $(this).fadeOut();
    });
}

//------- Utils -----------------------------//
function changeWall(t){
        $("#allConfig #liImagem li").css("border", "1px solid grey");
        $(t).css("border", "1px solid blue");
        //$("#bgFoto").css("background-image", $(this).css("background-image")).fadeIn();
        var pathImg = $(t).attr("style").split(":")[1].split(";")[0];
        $("#bgFoto").css("background-image", pathImg );
    //Atribui um valor ao alt do id preImg para funções posteriores
        $("#preImg").attr("alt","1");
        $(".bg").fadeOut();
    }