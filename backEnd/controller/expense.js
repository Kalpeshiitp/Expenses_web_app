const Expense = require('../models/expense');
const User = require("../models/user");

exports.postExpense = async (req, res) => {
  try {
    const { money, description, type } = req.body;
    if (money === undefined || money.length === 0) {
      return res.status(400).json({ success: false, message: "Parameter missing" });
    }
    const data = await Expense.create({ money: money, description: description, type: type, userId: req.user.id });

    // Calculate the new totalExpense
    const newExpense = Number(money);
    const updatedTotalExpense = Number(req.user.totalExpense) + newExpense;

    // Update the user's totalExpense in the database
    await User.update({ totalExpense: updatedTotalExpense }, {
      where: { id: req.user.id }
    });

    res.status(201).json({ newExpenseDetail: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
}


  exports.getExpense= async (req, res) => {
    try {
      const expenses = await Expense.findAll({where:{userId:req.user.id}});
      res.status(200).json({ allExpense: expenses });
    } catch (err) {
        console.log(err)
      res.status(500).json({ error: err.message });
    }
  }

  exports.deleteExpense = async(req,res)=>{
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
  await expense.destroy({where:{userId:req.user.id}});
  res.status(204).send()
    }catch(err){
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
  res.status(500).json({error:err.message})
   }

  }

