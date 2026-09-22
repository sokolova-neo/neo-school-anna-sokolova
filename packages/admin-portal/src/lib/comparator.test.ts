import { Order } from '../types/table';
import { getComparator } from './comparator';

describe('getComparator', () => {
  test('should compare strings based on order and order by - asc - id', async () => {
    const result = getComparator<{
      id: string;
      name: string;
    }>(Order.ASC, 'id')(
      {
        id: 'one',
        name: 'Patrick',
      },
      {
        id: 'two',
        name: 'Ian',
      },
    );

    expect(result).toEqual(-1);
  });
  test('should compare strings based on order and order by - desc - id', async () => {
    const result = getComparator<{
      id: string;
      name: string;
    }>(Order.DESC, 'id')(
      {
        id: 'one',
        name: 'Patrick',
      },
      {
        id: 'two',
        name: 'Ian',
      },
    );

    expect(result).toEqual(1);
  });
  test('should compare strings based on order and order by - asc - name', async () => {
    const result = getComparator<{
      id: string;
      name: string;
    }>(Order.ASC, 'name')(
      {
        id: 'one',
        name: 'Patrick',
      },
      {
        id: 'two',
        name: 'Ian',
      },
    );

    expect(result).toEqual(1);
  });
  test('should compare strings based on order and order by - desc - name', async () => {
    const result = getComparator<{
      id: string;
      name: string;
    }>(Order.DESC, 'name')(
      {
        id: 'one',
        name: 'Patrick',
      },
      {
        id: 'two',
        name: 'Ian',
      },
    );

    expect(result).toEqual(-1);
  });
  test('should compare strings based on order and order by - asc - name', async () => {
    const result = getComparator<{
      id: string;
      name: string;
    }>(Order.ASC, 'name')(
      {
        id: 'three',
        name: 'Ian',
      },
      {
        id: 'two',
        name: 'Ian',
      },
    );

    expect(result).toEqual(-0);
  });
  test('should compare strings based on order and order by - desc - name', async () => {
    const result = getComparator<{
      id: string;
      name: string;
    }>(Order.DESC, 'name')(
      {
        id: 'three',
        name: 'Ian',
      },
      {
        id: 'two',
        name: 'Ian',
      },
    );

    expect(result).toEqual(0);
  });
});
