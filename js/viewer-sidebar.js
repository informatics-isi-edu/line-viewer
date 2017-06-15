// plots sidebar js

var plots_sidebar=false;

// or could initiate a 'click' on
// the plotsButton
function dissmissPlots() {
  plotsClick();
}

// slide in/out and hide plots-button
function plotsClick() {
  plots_sidebar = !plots_sidebar;
  var btn = document.getElementById('plots-button');
  if(plots_sidebar) {
    sidebar_plots_slideOut();
    //hide button
    btn.style.opacity = 0;
    } else {
      sidebar_plots_slideIn();
      btn.style.opacity = 1;
  }
}

function sidebar_plots_slideOut() {
  if (jQuery('#plots').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#plots');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

function sidebar_plots_slideIn() {
  if (jQuery('#plots').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#plots');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}
