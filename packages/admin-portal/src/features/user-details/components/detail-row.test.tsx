import { renderWithProviders, screen } from '../../../../test/lib/test-utils';
import { DetailRow } from './detail-row';

describe('DetailRow', () => {
  const defaultProps = {
    label: 'label',
    value: 'value',
  };

  const renderDetailRow = (props = defaultProps) => {
    renderWithProviders(<DetailRow {...props} />);

    return {
      $getByText: (text: string) => screen.getByText(text),
    };
  };

  test('should render label', () => {
    const { $getByText } = renderDetailRow();

    expect($getByText(defaultProps.label)).toBeVisible();
  });

  test('should render value', () => {
    const { $getByText } = renderDetailRow();

    expect($getByText(defaultProps.value)).toBeVisible();
  });
});
