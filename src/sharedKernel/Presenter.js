export class Presenter {
  constructor({viewModel: defaultViewModel, listener: viewModelListener = (_viewModel) => null}) {
    this.viewModel = defaultViewModel;
    this.viewModelListener = viewModelListener;
  }

  onViewModelChange(callback) {
    this.viewModelListener = callback;
  }

  update(newValues) {
    this.viewModel = {...this.viewModel, ...newValues};
    this._refreshUI();
  }

  _refreshUI() {
    this.viewModelListener(this.immutableViewModel());
  }

  immutableViewModel() {
    return {...this.viewModel};
  }
}
