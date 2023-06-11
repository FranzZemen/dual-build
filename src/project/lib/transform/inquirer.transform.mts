import inquirer, {Answers, Question} from 'inquirer';
import {Transform} from "../../transform/index.js";

export type Questions = Question[];


export class InquirerTransform extends Transform<Questions,  Questions, any> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  protected transformContext(pipeIn?: Questions, payload?: Questions): Questions {
    return pipeIn ?? payload ?? [];
  }


  protected executeImpl(pipeIn?: Questions, payload?: Questions): Promise<any> {
   return inquirer
      .prompt(pipeIn ?? payload ?? [])
      .then((answers: Answers) => {
        this.contextLog.info(answers);
      })
      .catch((error) => {
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
