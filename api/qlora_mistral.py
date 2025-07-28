import torch
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, TrainingArguments
from peft import LoraConfig
from trl import SFTTrainer

model_name = "mistralai/Mistral-7B-Instruct-v0.2"
bnb_cfg = BitsAndBytesConfig(
    load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.float16
)
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_name, quantization_config=bnb_cfg, device_map="auto", trust_remote_code=True
)
model.config.use_cache = False

peft_cfg = LoraConfig(
    r=64, lora_alpha=16, lora_dropout=0.1,
    target_modules=["q_proj","v_proj"], bias="none", task_type="CAUSAL_LM"
)

train_data = load_dataset("json", data_files={"train":"dataset_qlora.jsonl"}, split="train")
tokenized = train_data.map(lambda ex: tokenizer(ex["input"], max_length=512, truncation=True), batched=False)

trainer = SFTTrainer(
    model=model, train_dataset=tokenized,
    peft_config=peft_cfg,
    args=TrainingArguments(
        per_device_train_batch_size=1, gradient_accumulation_steps=4,
        learning_rate=2e-4, max_steps=500, fp16=True,
        optim="paged_adamw_8bit", logging_steps=10, output_dir="./f1-mistral"
    ),
)

trainer.train()
trainer.model.save_pretrained("./f1-explainer2")
