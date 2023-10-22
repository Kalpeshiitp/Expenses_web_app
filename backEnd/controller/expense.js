const Expense = require('../models/expense');
const User = require("../models/user");
const sequelize = require('../util/database');


exports.postExpense = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { money, description, type } = req.body;
    if (money === undefined || money.length === 0) {
      return res.status(400).json({ success: false, message: "Parameter missing" });
    }
   
    const data = await Expense.create({ money: money, description: description, type: type, userId: req.user.id },{transaction:t});

    // Calculate the new totalExpense
    const newExpense = Number(money);
    console.log("newExpense>>>>>",newExpense)
    const updatedTotalExpense = Number(req.user.totalExpense) + newExpense;

    // Update the user's totalExpense in the database
    await User.update({ totalExpense: updatedTotalExpense }, {
      where: { id: req.user.id },transaction:t
    });
    
    await t.commit();
    res.status(201).json({ newExpenseDetail: data });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
}


  exports.getExpense= async (req, res) => {
    try {
      const expenses = await Expense.findAll({where:{userId:req.user.id}});
      const user = await User.findOne({where:{id:req.user.id}})
      const expenseSum = user.totalExpense;
      res.status(200).json({ allExpense: {expenses, expenseSum} });
    } catch (err) {
        console.log(err)
      res.status(500).json({ error: err.message });
    }
  }

  exports.deleteExpense = async(req,res)=>{
    const t = await sequelize.transaction()
    const expenseId = req.params.id
    try{
  const expense = await Expense.findByPk(expenseId);
if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  if (expense.userId !== req.user.id) {
    console.log('expense.userId:', expense.userId); 
    return res.status(403).json({ error: 'You are not authorized to delete this expense' });
  }
  
  const expenseAmount =  expense.money
  const user = await User.findByPk(req.user.id);
  user.totalExpense -= expenseAmount;
  await User.update({ totalExpense: user.totalExpense }, {
    where: { id: req.user.id },
    transaction: t,
  });
  await expense.destroy({where:{userId:req.user.id},transaction:t});
  await t.commit();
  res.status(204).send()
    }catch(err){
      await t.rollback();
        console.log(err)
      res.status(500).json({error:err.message})
    }
  }

  exports.putExpense =  async(req,res)=>{
    const expenseId = req.params.id;
   try{
    const expense = await Expense.findByPk(expenseId);
    if(!expense){
      return res.status(404).json({error:err.message})
    }
    res.status(200).json(expense);
    if (expense.userId !== req.user.id) {
        return res.status(403).json({ error: 'You are not authorized to edit this expense' });
      }
   }catch(err){
    await t.rollback();
  res.status(500).json({error:err.message})
   }

  }

