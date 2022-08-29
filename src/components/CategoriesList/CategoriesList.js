import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const CategoriesTypesList = (props) => {
  const { categories, type, title, select } = props || {};

  if (!categories || !categories.length) {
    return;
  }

  return (
    <div className='categories-types-list-wrapper'>
      <h3 className='categories-types-list-title'>{title}</h3>
      <div className='categories-types-list'>
        {categories
          ?.sort((a, b) => a.localeCompare(b))
          ?.map((category, index) => (
            <div
              key={index}
              className='categories-type'
              onClick={(e) => select(category, index)}>
              <span className='categories-type-title'>{category}</span>
              {type === 'remove' && (
                <CloseIcon className='categories-type-action' color='primary' />
              )}
              {type === 'add' && (
                <AddIcon className='categories-type-action' color='primary' />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoriesTypesList;
