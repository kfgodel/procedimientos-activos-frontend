import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['nameOrDescription'],
  nameOrDescription: "",
  actions: {
    createProcedure: function() {
      var newRecord = this.store.createRecord('procedure', {});
      newRecord.save();
      this.transitionToRoute('procedures.edit', newRecord);
    }
  },

  // We can do this while we have all the necessary data and the set is small enough
  filteredProcedures: Ember.computed('model','nameOrDescription', function() {
    var nameOrDescription = this.get('nameOrDescription');
    var procedures = this.get('model');

    if (!nameOrDescription) {
      return procedures;
    }
    return procedures.filter(function(item){
      var foundInName = item.get("name").indexOf(nameOrDescription) > -1;
      var foundInDescription = item.get("description").indexOf(nameOrDescription) > -1;
      return foundInName || foundInDescription;
    });
  })
});