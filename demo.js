/**
 * @jsx React.DOM
 */

function makeSelections() {
  var optCount = 50;
  var selections = [];
  for (var i = 0; i <= optCount; i++) {
    selections.push({id: i, text: "Option " + i})
  }
  return selections
}

selections = makeSelections();

var Demo = React.createClass({
  getInitialState: function () {
    return {
      selections: []
    }
  },

  handleSelections: function (e, selections) {
    this.setState({
      selections: selections
    })
  },

  render: function () {
    return (
        <div>
          <Select2Component
            id="the-hidden-input-id"
            dataSet={selections}
            onSelection={this.handleSelections}
            placeholder="Select some options"
            multiple={true}
            styleWidth="50%"
          />
          <br/>
          {JSON.stringify(this.state.selections, undefined, 2)}
        </div>
        );
  }
});

React.renderComponent(<Demo />, document.getElementById("render_area"));
