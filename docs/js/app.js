

const fileInput = document.querySelector ( '#fileInput' );
const moveH = document.querySelector ( '#moveH' )
const moveV = document.querySelector ( '#moveV' );
const download = document.querySelector ( '#download' )
const holder = document.querySelector ( '#canvas' )

disableElements ( [moveH, moveV, download], true );

const drawer = new CanvasDrawer();
drawer.attach ( holder );

moveH.addEventListener ( 'click', function ( event ) {
  this.classList.toggle ( 'active' );
  drawer.flip('offsetH');
})

moveV.addEventListener ( 'click', function ( event ) {
  this.classList.toggle ( 'active' );
  drawer.flip('offsetV');
})

download.addEventListener ( 'click', function ( event ) {
  let data = drawer.getOffsetImage().toDataURL();
  downloadImage ( data );
})


fileInput.addEventListener ( 'change', function ( event ) {
  let reader = new FileReader();
  reader.addEventListener ( 'load', function ( event ) {
    let image = new Image();
    image.src = reader.result;
    drawer.saveImage ( image );
  });
  reader.readAsDataURL ( this.files[0] );
})

function CanvasDrawer ( ) {

  const $private = {};
  $private.canvas = cvs ( 600 );
  $private.offsetH = false;
  $private.offsetV = false;

  this.flip = offset => {
    $private[offset] = !$private[offset];
    $private.draw();
  };

  this.attach = element => element.appendChild ( $private.canvas );

  this.saveImage = image => {
    $private.image = image;
    image.addEventListener ( 'load', event => {
      $private.draw();
      disableElements ( [moveH, moveV, download], false );
    })
  }

  this.getOffsetImage = ( ) => offsetImage ( $private.image, $private.offsetH, $private.offsetV );

  $private.draw = ( ) => {
    let image = this.getOffsetImage();
    cvs ( $private.canvas, ( ctx, canvas ) => {
      ctx.clearRect ( 0, 0, canvas.width, canvas.height );
      ctx.drawImage(image,0,0,canvas.width,canvas.height);
    }, true );
  }
}


let testimg = new Image();
testimg.src = './test.png';
drawer.saveImage ( testimg )
// testimg.onload = ( ) => {
//
//   showCanvas ( offsetImage(testimg,true,true))
//   showCanvas ( offsetImage(testimg,true,false))
//   showCanvas ( offsetImage(testimg,false,true))
//   showCanvas ( offsetImage(testimg,false,false))
// }

// function showCanvas ( canvas ){
//   canvas.style = 'display:inline-block;width:200px;height:200px;border:solid 2px red';
//   document.body.appendChild ( canvas );
// }

function disableElements ( elements, state ) {
  elements.forEach ( element => element.disabled = state );
}

function funnyUid ( ) {
  let adj1 = ['Funny','Pretty','Dashing','Cute','Glamorous','Stunning'];
  let adj2 = ['Adventurous','Brave','Inquisitive','Wise','Smart','Strong'];
  let noun = ['Beaver','Otter','Beagle','Corgi','Donkey','Seal','Pup','Kitten'];
  let random = arr => arr[Math.round(Math.random()*(arr.length-1))];
  return random(adj1)+random(adj2)+random(noun);
}

function downloadImage ( data ) {

  const fileName = `Seamlessify_${funnyUid()}.png`;
  const link = document.createElement ( 'a' );
  link.setAttribute("href", data);
  link.setAttribute("download", fileName);
  link.click();

}

function offsetImage ( image, offsetH, offsetV ) {
  return cvs ( image, ctx => {

    let repeatX = offsetH ? 1 : 2;
    let repeatY = offsetV ? 1 : 2;

    let startX = offsetH ? - image.width / 2 : 0;
    let startY = offsetV ? - image.height / 2 : 0;

    let posX = startX, posY = startY;

    for ( let xR = 0; xR <= repeatX; xR++ ) {

      posY = startY;

      for ( let yR = 0; yR <= repeatY; yR++ ) {

        ctx.drawImage ( image, posX, posY, image.width, image.height );
        posY += image.height;

      }
      posX += image.width;
    }


  })
}



function cvs ( source, callback, on = false ) {

  let canvas;

  if ( on === true ) {
    canvas = source;
  } else {
    canvas = document.createElement ( 'canvas' );
    if ( source.width && source.height ) {
      canvas.width = source.width, canvas.height = source.height;
    } else if ( typeof source === 'number' ) {
      canvas.width = source, canvas.height = source;
    } else if ( source instanceof Array ) {
      canvas.width = source[0], canvas.height = source[1];
    }
  }

  if ( callback ) {
    let ctx = canvas.getContext ( '2d' );
    callback ( ctx, canvas );
  }

  return canvas;

}
