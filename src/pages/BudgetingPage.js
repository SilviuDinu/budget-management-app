import axios from 'axios';
import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import BudgetingControl from '../components/BudgetingControl/BudgetingControl';
import { ExpenseTypesContext } from '../contexts/expenseTypesContext';
import CategoriesTypesList from '../components/CategoriesList/CategoriesList';
import { ExpensesContext } from '../contexts/expensesContext';

function BudgetingPage() {
  const user = useUser();
  const { id } = user || {};
  const [token] = useToken();
  const [expenses] = useContext(ExpensesContext);
  const { categories, setCategories } = useContext(ExpenseTypesContext);
  const [defaultCategories, setDefaultCategories] = useState(categories || []);
  const [budgets, setBudgets] = useState([
    {
      title: 'Main',
      salary: 10000,
      budgetControls: [
        {
          title: 'fun',
          min: 0,
          max: 1500,
          value: 0,
          linkedCategories: ['groceries'],
        },
        {
          title: 'living',
          min: 0,
          max: 2000,
          value: 0,
          linkedCategories: ['living'],
        },
      ],
    },
  ]);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [newBudgetControl, setNewBudgetControl] = useState({});
  const [addingNewBudgetControl, setAddingNewBudgetControl] = useState(false);
  const [addingNewBudget, setAddingNewBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({});
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salary, setSalary] = useState(10000);
  const [message, setMessage] = useState('');

  useEffect(() => {
    budgets.forEach((budget) => {
      budget.budgetControls.forEach((control) => {
        const totalValue = getTotalValue(control.linkedCategories);
        control.value = totalValue;
      });
    });
    setBudgets([...budgets]);
    setDefaultCategories([...categories]);
  }, [expenses, categories]);

  const handleCategoryAdd = (category, index) => {
    if (!category) return;
    newBudgetControl.linkedCategories = [
      ...(newBudgetControl.linkedCategories || []),
      category,
    ];
    const categoriesIndex = defaultCategories.indexOf(category);
    defaultCategories.splice(categoriesIndex, 1);

    setDefaultCategories([...defaultCategories]);
    setNewBudgetControl({ ...newBudgetControl });
  };

  const handleCategoryRemove = (category, index) => {
    if (!category) return;
    const foundIndex = newBudgetControl.linkedCategories.indexOf(category);
    newBudgetControl.linkedCategories.splice(foundIndex, 1);

    if (defaultCategories.indexOf(category) === -1) {
      setDefaultCategories([...defaultCategories, category]);
    }
    setNewBudgetControl({ ...newBudgetControl });
  };

  const handleBudgetControlUpdate = (value, budgetIndex, controlIndex) => {
    if (value <= budgets[budgetIndex].budgetControls[controlIndex].max) {
      budgets[budgetIndex].budgetControls[controlIndex].value = value;
      setBudgets([...budgets]);
    }
  };

  const getTotalValue = (linkedCategories) => {
    return expenses.reduce(
      (acm, exp) =>
        linkedCategories.includes(exp.category)
          ? acm + Number(exp.amount)
          : acm,
      0
    );
  };

  const addNewBudgetControl = (budgetIndex) => {
    if (!newBudgetControl) return;
    const totalValue = getTotalValue(newBudgetControl.linkedCategories);
    budgets[budgetIndex].budgetControls.push({
      ...newBudgetControl,
      value: totalValue,
    });
    setBudgets([...budgets]);
    setDefaultCategories([...categories]);
    clearNewBudgetControl();
  };

  const addNewBudget = () => {
    if (!newBudget) return;
    setBudgets([...budgets, newBudget]);
    clearNewBudget();
  };

  const clearNewBudgetControl = () => {
    setNewBudgetControl({});
    setAddingNewBudgetControl(false);
    setDefaultCategories([...categories]);
  };

  const clearNewBudget = () => {
    setNewBudget({});
    setAddingNewBudget(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `/api/users/${id}/set-budgeting-plan/`,
        {
          budgetingPlan: {},
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        const { message } = response.data;
        setShowSuccessMessage(true);
        setMessage(message);
      }
    } catch (err) {
      setShowErrorMessage(true);
      setMessage(message);
    }
  };

  return (
    <div className='container'>
      <h1>Your budget plans</h1>
      {showSuccessMessage && (
        <div className='success'>{message || 'Succesful action'}</div>
      )}
      {showErrorMessage && <div className='fail'>{message || 'Failed'}</div>}

      {budgets?.map((budget, budgetInex) => {
        const { salary, budgetControls = [] } = budget;
        return (
          <div key={budgetInex} className='budget-card'>
            <div className='salary'>
              {salary && salary > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {!isEditingSalary ? (
                    <>
                      <h2 style={{ marginRight: '0.8rem' }}>
                        {(
                          Number(salary) -
                          budgetControls.reduce(
                            (acm, v) => (v ? acm + Number(v.value) : acm),
                            0
                          )
                        ).toFixed(2)}{' '}
                        RON available
                      </h2>
                      <EditIcon
                        className='icon'
                        color='primary'
                        style={{ width: '2rem', height: '2rem' }}
                        onClick={(e) => setIsEditingSalary(true)}
                      />
                    </>
                  ) : (
                    <div style={{ display: 'flex' }}>
                      <input
                        type='text'
                        style={{ marginRight: '0.8rem' }}
                        value={
                          Number(salary) -
                          budgetControls.reduce(
                            (acm, v) => (v ? acm + Number(v.value) : acm),
                            0
                          )
                        }
                        onChange={(e) => setSalary(e.target.value)}
                      />
                      <button
                        className='btn'
                        onClick={(e) => setIsEditingSalary(false)}>
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='add-salary'>
                  <label htmlFor='salary'>Please add your salary</label>
                  <input
                    type='number'
                    name='salary'
                    onChange={(e) => setSalary(Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            {budgetControls?.map((control, idx) => (
              <BudgetingControl
                key={idx}
                control={control}
                disableSlider={!isEditingSalary}
                disableInput={!isEditingSalary}
                onUpdate={(value, i) =>
                  handleBudgetControlUpdate(value, budgetInex, idx)
                }
              />
            ))}

            {!addingNewBudgetControl && (
              <AddCircleIcon
                className='icon'
                color='primary'
                style={{ width: '2rem', height: '2rem' }}
                onClick={(e) => setAddingNewBudgetControl(true)}
              />
            )}
            {addingNewBudgetControl && (
              <div className='add-new-budget-control'>
                <label htmlFor='control-title'>Title</label>
                <input
                  type='text'
                  name='control-title'
                  onChange={(e) =>
                    setNewBudgetControl({
                      ...newBudgetControl,
                      title: e.target.value,
                    })
                  }
                />
                <label htmlFor='control-min'>Min</label>
                <input
                  type='text'
                  name='control-min'
                  onChange={(e) =>
                    setNewBudgetControl({
                      ...newBudgetControl,
                      min: e.target.value,
                    })
                  }
                />
                <label htmlFor='control-max'>Max</label>
                <input
                  type='text'
                  name='control-max'
                  onChange={(e) =>
                    setNewBudgetControl({
                      ...newBudgetControl,
                      max: e.target.value,
                    })
                  }
                />
                {!!newBudgetControl?.linkedCategories?.length && (
                  <CategoriesTypesList
                    categories={newBudgetControl.linkedCategories}
                    title='Your choices'
                    select={(value, i) => handleCategoryRemove(value, budgetInex)}
                    type='remove'
                  />
                )}
                {!!defaultCategories.length && (
                  <CategoriesTypesList
                    categories={defaultCategories}
                    title='Choose the categories you want to monitor with this control'
                    select={(value, i) => handleCategoryAdd(value, budgetInex)}
                    type='add'
                  />
                )}
                <button
                  type='submit'
                  className='btn'
                  disabled={
                    !(
                      !!newBudgetControl.min &&
                      !!newBudgetControl.max &&
                      !!newBudgetControl.title &&
                      !!newBudgetControl.linkedCategories?.length
                    )
                  }
                  onClick={(e) => addNewBudgetControl(budgetInex)}>
                  Add
                </button>
                <button className='btn' onClick={clearNewBudgetControl}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      })}

      <AddCircleIcon
        className='icon'
        color='primary'
        style={{ width: '2rem', height: '2rem' }}
        onClick={(e) => setAddingNewBudget(true)}
      />
      {addingNewBudget && (
        <div className='add-new-budget'>
          <label htmlFor='control-title'>Title</label>
          <input
            type='text'
            name='control-title'
            onChange={(e) =>
              setNewBudget({
                ...newBudget,
                title: e.target.value,
              })
            }
          />
          <label htmlFor='control-salary'>Budget</label>
          <input
            type='text'
            name='control-salary'
            onChange={(e) =>
              setNewBudget({
                ...newBudget,
                salary: Number(e.target.value),
              })
            }
          />
          <button type='submit' className='btn' onClick={addNewBudget}>
            Add
          </button>
          <button className='btn' onClick={clearNewBudget}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default BudgetingPage;
