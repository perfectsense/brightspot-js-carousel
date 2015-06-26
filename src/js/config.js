System.config({
  defaultJSExtensions: true,
  map: {
  	'jquery': 'jquery/dist/jquery',
    'slick': 'slick-carousel/slick/slick'
  },
  meta: {
    'jquery' : {
      build: false
    }
  },
  transpiler: 'babel'
});