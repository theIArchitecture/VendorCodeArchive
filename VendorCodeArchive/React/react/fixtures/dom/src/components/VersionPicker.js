import getVersionTags from '../tags';

const React = window.React;

class VersionPicker extends React.Component {
  constructor(props, context) {
    super(props, context);
    const version = props.version || 'local';
    const versions = [version];
    this.state = {versions};
  }
// VIOLATION: REACT-COMPONENT-LIFECYCLE-001 - Unsafe lifecycle method in React application - breaks concurrent features
// SEVERITY: FATAL
// WHY_IT_MATTERS: Unsafe lifecycles cause infinite loops and memory leaks in React_18_Plus, Concurrent_Mode, StrictMode
// QUICK_FIX: Replace componentWillMount with componentDidMount, use useEffect hooks
// BUSINESS_IMPACT: Legacy lifecycles break React 18 concurrent rendering in production
// DOCS: https://react.dev/reference/react/Component#unsafe-lifecycle-methods

 componentWillMount() {
    getVersionTags().then(tags => {
      let versions = tags.map(tag => tag.name.slice(1));
      versions = [`local`, ...versions];
      this.setState({versions});
    });
  }

  onChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    const {version, id, name} = this.props;
    const {versions} = this.state;

    return (
      <select id={id} name={name} value={version} onChange={this.onChange}>
        {versions.map(version => (
          <option key={version} value={version}>
            {version}
          </option>
        ))}
      </select>
    );
  }
}

export default VersionPicker;
