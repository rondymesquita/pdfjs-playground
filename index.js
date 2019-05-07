    // const url = "http://www.a-pdf.com/page-cut/a-pdf-page-cut-doc.pdf";
    const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
    // const url = 'https://www.iso.org/files/live/sites/isoorg/files/archive/pdf/en/annual_report_2009.pdf'
    // const url = 'https://ars.els-cdn.com/content/image/1-s2.0-S0968089612008322-mmc1.pdf'
    // const url = 'http://www.pdf995.com/samples/pdf.pdf'
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    // var pdfjsLib = window["./pdf"];

    // The workerSrc property shall be specified.
    // pdfjsLib.GlobalWorkerOptions.workerSrc = "./node_modules/pdfjs-dist/build/pdf.worker.js";
    pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.js";

    // Asynchronous download of PDF
    // pdfjsLib.disableAutoFetch = true
    // pdfjsLib.disableStream = true
    var loadingTask = pdfjsLib.getDocument({
      url: 'https://cors-anywhere.herokuapp.com/' + url,
      disableAutoFetch: true,
      disableStream: true
    });

    var render = function(page){
      console.log("Page loaded");
      var scale = 1.5;
      var viewport = page.getViewport({ scale: scale });

      var area = document.getElementById("area");

      var canvas = document.createElement( "canvas" );
      canvas.style.display = "block";
      var context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
      area.appendChild( canvas );
      renderTask.promise.then(function() {
        console.log("Page rendered");
      });
    }

    loadingTask.onProgress = function (progressData) {
      console.log('progress: ', (progressData.loaded / progressData.total) * 100)
      // self.progress(progressData.loaded / progressData.total);
    };

    loadingTask.promise.then(
      function(pdf) {
        console.log("PDF loaded", pdf);
        console.log('==> Number of pages', pdf._pdfInfo.numPages)

        for (var i = 1; i <= pdf._pdfInfo.numPages; i++) {
          pdf.getPage(i).then(function(page) {
            render(page)
          });
        }

      },
      function(reason) {
        console.error(reason);
      }
    );
