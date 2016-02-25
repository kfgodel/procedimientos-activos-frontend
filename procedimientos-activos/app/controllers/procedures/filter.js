import Ember from 'ember';
import ProcedureRepositoryInjected from '../../mixins/procedure-repository-injected';

export default Ember.Controller.extend(ProcedureRepositoryInjected, {
  actions: {
    createProcedure: function() {
      this.promiseWaitingFor(this.repo().createProcedure())
        .whenSucceeded(Ember.run.bind(this, this.onProcedureCreated))
        .whenInterruptedAndReauthenticated(Ember.run.bind(this, this.onReauthenticated));
    },
    tagClicked(clickedTag){
      this.showProceduresMatching(clickedTag);
    }
  },

  //PRIVATE
  onProcedureCreated(createdTo){
    this.navigator().navigateToProcedureEdit(createdTo);
  },
  onReauthenticated(){
    this.navigator().navigateToProceduresList();
  },
  showProceduresMatching(clickedTag) {
    this.navigator().navigateToProceduresListFilteringBy(clickedTag);
  }
});