const Expense = require('../models/expense');

exports.postExpense = async(req,res)=>{
    try {
      const money = req.body.money;
      const description =req.body.description;
      const type = req.body.type
      const data = await Expense.create({
        money: money,
        description: description,
        type: type,
      });
      res.status(201).json({ newExpenseDetail: data });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  exports.getExpense= async (req, res) => {
    try {
      const expenses = await Expense.findAll();
      res.status(200).json({ allExpense: expenses });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  exports.deleteExpense = async(req,res)=>{
    const expenseId = req.params.id

    try{
  const expense = await Expense.findByPk(expenseId);
  if(!expense){
    return res.status(404).json({error:err.message})
  }
  await expense.destroy();
  res.status(204).send()
    }catch(err){
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
   }catch(err){
  res.status(500).json({error:err.message})
   }

  }