const pageModel = (state = [], {type, payload}) => {
    switch (type) {
      case 'saveConfig':
          console.log('saveConfig start', payload);
        return {
          ...state,
          ...payload
        }
      default:
        return state
    }
  }
  
  export default pageModel;
  