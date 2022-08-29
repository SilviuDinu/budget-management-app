import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const ExpenseTypesList = (props) => {
  const { expenseTypes, type, title, select } = props || {};

  if (!expenseTypes || !expenseTypes.length) {
    return;
  }

  return (
    <div className='expense-types-list-wrapper'>
      <h3 className='expense-types-list-title'>{title}</h3>
      <div className='expense-types-list'>
        {expenseTypes
          ?.sort((a, b) => a.title?.localeCompare(b?.title))
          ?.map((expenseType, index) => (
            <div
              key={index}
              className='expense-type'
              onClick={(e) => select(expenseType)}>
              <span className='expense-type-title'>{expenseType.title}</span>
              {type === 'remove' && (
                <CloseIcon className='expense-type-action' color='primary' />
              )}
              {type === 'add' && (
                <AddIcon className='expense-type-action' color='primary' />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExpenseTypesList;
