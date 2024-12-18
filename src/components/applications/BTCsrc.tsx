import React, { useState } from 'react';
import DosPlayer from '../dos/DosPlayer';
import Window from '../os/Window';

export interface BTCAppProps extends WindowAppProps {}

const BTCsrc: React.FC<BTCAppProps> = (props) => {
    const [width, setWidth] = useState(700);
    const [height, setHeight] = useState(550);
    const [showPopup, setShowPup] = useState(0)
    const code = `
use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug)]
struct Account {
    pub owner: String,
    pub lamports: u64,
}

#[derive(Clone, Debug)]
struct Transaction {
    pub from: String,
    pub to: String,
    pub amount: u64,
    pub signature: String,
}

#[derive(Clone, Debug)]
struct Block {
    pub slot: u64,
    pub parent_slot: u64,
    pub transactions: Vec<Transaction>,
    pub leader: String,
}

struct Ledger {
    pub accounts: HashMap<String, Account>,
    pub blocks: Vec<Block>,
}

impl Ledger {
    fn new() -> Self {
        Ledger {
            accounts: HashMap::new(),
            blocks: Vec::new(),
        }
    }

    fn apply_block(&mut self, block: &Block) {
        for tx in &block.transactions {
            self.apply_transaction(tx);
        }
        self.blocks.push(block.clone());
    }

    fn apply_transaction(&mut self, tx: &Transaction) {
        if let Some(sender) = self.accounts.get_mut(&tx.from) {
            if sender.lamports >= tx.amount {
                sender.lamports -= tx.amount;
                let recipient = self.accounts.entry(tx.to.clone()).or_insert(Account {
                    owner: tx.to.clone(),
                    lamports: 0,
                });
                recipient.lamports += tx.amount;
            }
        }
    }
}

trait SolanaProgram {
    fn process_instruction(&mut self, instruction_data: &[u8]);
}

struct ExampleProgram {
    pub data: u64,
}

impl SolanaProgram for ExampleProgram {
    fn process_instruction(&mut self, instruction_data: &[u8]) {
        let increment = instruction_data.get(0).cloned().unwrap_or(1) as u64;
        self.data += increment;
    }
}

struct ConsensusSimulator {
    pub validators: Vec<String>,
    pub current_leader: usize,
    pub pending_transactions: VecDeque<Transaction>,
}

impl ConsensusSimulator {
    fn new(validators: Vec<String>) -> Self {
        ConsensusSimulator {
            validators,
            current_leader: 0,
            pending_transactions: VecDeque::new(),
        }
    }

    fn select_leader(&mut self) -> String {
        let leader = self.validators[self.current_leader].clone();
        self.current_leader = (self.current_leader + 1) % self.validators.len();
        leader
    }

    fn produce_block(&mut self, parent_slot: u64, ledger: &Ledger) -> Block {
        let leader = self.select_leader();
        let txs: Vec<Transaction> = self.pending_transactions.drain(..).collect();
        Block {
            slot: ledger.blocks.len() as u64 + 1,
            parent_slot,
            transactions: txs,
            leader,
        }
    }
}

fn main() {
    let mut ledger = Ledger::new();
    ledger.accounts.insert("alice".to_string(), Account {
        owner: "alice".to_string(),
        lamports: 1_000,
    });
    ledger.accounts.insert("bob".to_string(), Account {
        owner: "bob".to_string(),
        lamports: 500,
    });

    let mut consensus = ConsensusSimulator::new(vec![
        "validator1".to_string(),
        "validator2".to_string(),
        "validator3".to_string(),
    ]);

    consensus.pending_transactions.push_back(Transaction {
        from: "alice".to_string(),
        to: "bob".to_string(),
        amount: 100,
        signature: "alice_sig".to_string(),
    });

    consensus.pending_transactions.push_back(Transaction {
        from: "bob".to_string(),
        to: "alice".to_string(),
        amount: 50,
        signature: "bob_sig".to_string(),
    });

    let block = consensus.produce_block(0, &ledger);
    ledger.apply_block(&block);

    println!("Ledger after block 1: {:?}", ledger.accounts);

    let mut program = ExampleProgram { data: 10 };
    program.process_instruction(&[5]);

    consensus.pending_transactions.push_back(Transaction {
        from: "alice".to_string(),
        to: "charlie".to_string(),
        amount: 200,
        signature: "alice_sig2".to_string(),
    });

    let block2 = consensus.produce_block(block.slot, &ledger);
    ledger.apply_block(&block2);

    println!("Ledger after block 2: {:?}", ledger.accounts);
    println!("Blocks: {:?}", ledger.blocks);
}
`;

    return (
        <Window
            top={10}
            left={10}
            width={width}
            height={height}
            windowTitle="Solana source code"
            windowBarColor="#000000"
            windowBarIcon="windowGameIcon"
            bottomLeftText={'Powered by Anatoly Yakovenko'}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
        >
            <div
                className="container-code"
                style={{
                    display: 'block',
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    background: 'black',
                }}
            >
                <pre
                    style={{
                        color: 'green',
                        backgroundColor: 'black',
                        padding: '10px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',

                        overflow: 'auto',
                        fontSize: '14px',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {code}
                </pre>
                <div className="button-content" style={styles.buttonContent}>
                    <button style={styles.button} onClick={() => setShowPup(1)}>Run</button>
                </div>
            </div>
            <div className="container-btc" style={{opacity: showPopup}}>
                <Window
                    top={10}
                    left={10}
                    width={350}
                    height={150}
                    windowTitle="Success!"
                    windowBarColor="#000000"
                    windowBarIcon="windowGameIcon"
                    bottomLeftText={''}
                    closeWindow={props.onClose}
                    onInteract={props.onInteract}
                    minimizeWindow={props.onMinimize}
                    onWidthChange={setWidth}
                    onHeightChange={setHeight}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                        className="p-container"
                    >
                        <p>Solana is running...</p>
                    </div>
                </Window>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    button: {
        padding: '0px 72px',
        background: 'transparent',
        zIndex: 2,
        color: 'black',
        position: 'fixed',
        fontSize: '12px',
    },
    buttonContent: {
        position: 'absolute',
        bottom: '-10px',
        right: '179px',
    },
};

export default BTCsrc;
