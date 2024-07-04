export function printDiv(divId: string) {
  const css = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
  integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">`;
  const printContents = document.getElementById(divId)?.innerHTML
  const pageContent = `<!DOCTYPE html><html><head></head><body onload="window.print()"> <div class="row text-center"> ${printContents} </div> </html>`;
  let popupWindow: Window | null
 

  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    popupWindow = window.open(  '',  '_blank',
      'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
    );
 
    if (popupWindow !== null) { 
    popupWindow.window.focus();
    popupWindow.document.write(pageContent);
      popupWindow.document.close();

    popupWindow.onbeforeunload = event => {
      if (popupWindow !== null) { 
      popupWindow.close();
    }
    };

    popupWindow.onabort = event => {
      if (popupWindow !== null) { 
      popupWindow.document.close();
      popupWindow.close();
      }
    };

  }

  } else {

    popupWindow = window.open('', '_blank', 'width=600,height=600');
    if (popupWindow !== null) {
    popupWindow.document.open();
    popupWindow.document.write(pageContent);
    popupWindow.document.close();
  }
  }
  
}

