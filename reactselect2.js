/**
 * @jsx React.DOM
 */

var Select2Component = React.createClass({
  propTypes: {
    // Id to apply to hidden input element
    id: React.PropTypes.string.isRequired,

    // Data for Select2,
    dataSet: React.PropTypes.array.isRequired,

    // If true apply the prop `errorClass`
    hasError: React.PropTypes.bool,

    // Class to apply if hasError is true.
    errorClass: React.PropTypes.string,

    // Function to call with currently selected elements
    onSelection: React.PropTypes.func,

    // Allow multiple selections
    multiple: React.PropTypes.bool,

    // Placeholder to display in select
    placeholder: React.PropTypes.string,

    // Initial selection.  If not `multiple` then will use first element.
    // Provide a list of ids, no need to provide whole objects as provided to `dataSet`
    val: React.PropTypes.arrayOf(React.PropTypes.number),

    // inline style for select
    styleWidth: React.PropTypes.string,

    // enable or disable the input
    enabled: React.PropTypes.bool,

    // template function for rendering formatResult
    onFormatResult: React.PropTypes.func,

    // template function for rendering formatSelection
    onFormatSelection: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      hasError: false,
      errorClass: "has-error",  // default to Bootstrap 3's error class
      multiple: false,
      placeholder: "Make selection",
      val: [],
      styleWidth: "100%",
      enabled: true,
      dataSet: []
    };
  },

  ///////////////////////////////
  // Lifecycle
  ///////////////////////////////
  componentDidUpdate: function (prevProps, prevState) {
    if (this._isDataUpdated(prevProps.dataSet)) {
      // "brute-force" new data into our Select2 widget since Select2 doesn't
      // have a method for changing data on already-existing widgets
      this.createSelect2();
    } else {
      // Change placeholder
      if (prevProps.placeholder !== this.props.placeholder) {
        this.setPlaceholderTo(this.getInputElem(), this.props.placeholder);
      }

      // Handle val prop
      var updateVal = false;
      // ...if length of old val prop and new val prop arrays are the same,
      //    we'll need to check the elements
      if (prevProps.val.length == this.props.val.length) {
        $.each(prevProps.val, function (index, value) {
          if (this.props.val[index] != value) {
            updateVal = true;
          }
        }.bind(this));

      } else {
        updateVal = true;
      }
      // ...update our val if we need to
      if (updateVal) {
        this.getInputElem().select2("val", this.props.val);
      }

      // Enable/disable
      if (prevProps.enabled != this.props.enabled) {
        this.getInputElem().select2("enable", this.props.enabled);
      }
    }
  },

  componentDidMount: function () {
    // Set up Select2
    var $node = this.createSelect2();
  },

  ///////////////////////////////
  // Manipulate Select2
  ///////////////////////////////
  setPlaceholderTo: function($elem, placeholder) {
    if (!placeholder) {
      placeholder = "";
    }
    var currData = $elem.select2("data");

    // Set placeholder to new placeholder
    $elem.attr("placeholder", placeholder);

    // Now workaround the fact that Select2 doesn't pick up on this
    // ..First assign null
    $elem.select2("data", null);

    // ..Then assign dummy value in case that currData is null since
    //   that won't do anything.

    $elem.select2("data", {});

    // ..Then put original data back
    $elem.select2("data", currData);
  },

  createSelect2: function () {
    // Get inital value
    var val = null;
    if (this.props.val.length > 0) {
      val = this.props.multiple ? this.props.val : this.props.val[0];
    }

    var that = this;
    var options = {
      data: this.props.dataSet,
      multiple: this.props.multiple,
      val: val,
      formatResult: function(state) {
        if(that.props.onFormatResult)
          return that.props.onFormatResult(state);
        else
          return state.text;
      },
      formatSelection: function(state) {
        if(that.props.onFormatSelection)
          return that.props.onFormatSelection(state);
        else
          return state.text;
      }
    };

    var $node = this.getInputElem();
    $node.
      val(val).
      select2(options).
      on("change", this.handleChange).
      on("select2-open", this.handleErrorState).
      select2("enable", this.props.enabled);
    this.setPlaceholderTo($node, this.props.placeholder);
  },

  ///////////////////////////////
  // Helpers
  ///////////////////////////////
  handleErrorState: function () {
    var $dropNode = $('#select2-drop');
    var classNames = $dropNode[0].className.split(/\s+/);

    if (this.props.hasError) {
      var hasErrorClass = $.inArray(this.props.errorClass, classNames);

      if (hasErrorClass == -1) {
        $dropNode.addClass(this.props.errorClass);
      }

    } else {
      $dropNode.removeClass(this.props.errorClass);
    }
  },

  handleChange: function (e) {
    if (this.props.onSelection) {
      this.props.onSelection(e, this.getInputElem().select2("data"));
    }
  },

  getInputElem: function () {
    return $("#" + this.props.id);
  },

  _isDataUpdated: function (oldData) {
    var tmp = [];
    for(var i = 0; i < this.props.dataSet.length; i++)
      tmp[this.props.dataSet[i].id] = true;
    for(var i = 0; i < oldData.length; i++)
      if(!tmp[oldData[i].id]) return true;
    return false;
  },

  render: function () {
    var style = {width: this.props.styleWidth};
    return (
      <div className={this.props.hasError ? this.props.errorClass : ""}>
        <input type='hidden' style={style} id={this.props.id}/>
      </div>
      );
  }
});
