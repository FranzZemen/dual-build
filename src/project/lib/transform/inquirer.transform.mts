import inquirer, {Answers, Question} from 'inquirer';
import {Transform} from "../../transform/index.js";

export function isLikelyQuestion(obj: any | Question): obj is Question {
  return obj && 'type' in obj && 'name' in obj && 'message' in obj;
}

export type Questions = Question[];

export function isQuestions(arr: any | Questions): arr is Questions {
  return arr && Array.isArray(arr) && arr.every(question => isLikelyQuestion(question));
}


export class InquirerTransform extends Transform<Questions,  Questions, any> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  protected transformContext(pipeIn?: Questions, payload?: Questions): Questions {
    return pipeIn ?? payload ?? [];
  }


  protected async executeImpl(pipeIn?: Questions, payload?: Questions): Promise<any> {
   return await inquirer
     .prompt (isQuestions(pipeIn) ? pipeIn : isQuestions(payload) ? payload : [])
      .then((answers: Answers) => {
        this.contextLog.info(answers);
        return answers;
      })
      .catch(error => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          this.contextLog.error(error);
          throw error;
          // Something else went wrong
        }
      });
    }
}
