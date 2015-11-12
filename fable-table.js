(function(window, document){

  var FableTable = function(wrapper) {
    this.wrapper = wrapper;
    this.table = wrapper.querySelector('table');
    this.header = this.table.querySelector('thead');
    this.headerClone = this.header.cloneNode(true);

    this.checkAndMoveHeader = this.checkAndMoveHeader.bind(this);
  };


  FableTable.prototype.prepareHeadColumn = function(column, reference) {
    var computedStyle = window.getComputedStyle(reference, null);

    column.style.display = 'inline-block';
    column.style.minWidth = reference.offsetWidth + 'px';

    column.style.padding = computedStyle.getPropertyValue('padding');
    column.style.border = computedStyle.getPropertyValue('border');

    return this;
  };

  FableTable.prototype.prepareHeaderClone = function() {
    this.headerClone.className += ' fab-tab-header';
    this.headerClone.style.display = 'table';
    this.headerClone.style.width = this.header.offsetWidth + 'px';

    var headings = this.header.querySelectorAll('th');
    var headingsClone = this.headerClone.querySelectorAll('th');

    for (var i in headings) {
      if (headings.hasOwnProperty(i)) {
        var heading = headings[i];
        var headingClone = headingsClone[i];
        this.prepareHeadColumn(headingClone, heading);
      }
    }

    return this;
  };

  FableTable.prototype.prependHeaderClone = function() {
    this.wrapper.insertBefore(this.headerClone, this.table);
    return this;
  };

  FableTable.prototype.checkAndMoveHeader = function() {
    // console.log(this.header.offsetTop);
    var tableOffset = FableTable.util.offset(this.header);
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    var tableYOffset = tableOffset.y - scrollTop;

    if (tableYOffset < 0) {
      this.headerClone.style.display = 'block';
      this.headerClone.style.top = -1*tableYOffset + 'px';
    } else {
      this.headerClone.style.display = 'none';
    }

    setTimeout(this.checkAndMoveHeader, 500);
    return this;
  };

  FableTable.prototype.addDistanceCheck = function() {
    setTimeout(this.checkAndMoveHeader, 500);

    return this;
  };

  FableTable.prototype.initialize = function() {
    this
    .prepareHeaderClone()
    .prependHeaderClone()
    .addDistanceCheck();

    return this;
  };

  FableTable.util = {};

  FableTable.util.offset = function(element, paramOffset) {
    if (!element) {
      return
    };

    var offset = paramOffset ? paramOffset : { x: 0, y: 0 };
    offset.x += element.offsetLeft;
    offset.y += element.offsetTop;

    FableTable.util.offset(element.offsetParent, offset);

    if (!paramOffset) {
      return offset;
    }
  };

  window.fabtab = function(tableSelector) {
    var tableWrappers = document.querySelectorAll(tableSelector);

    for (var i in tableWrappers) {
      if (tableWrappers.hasOwnProperty(i)) {
        var wrapper = tableWrappers[i];
        new FableTable(wrapper).initialize();
      }
    }
  };

}(window, document));


fabtab('.table-wrapper');
