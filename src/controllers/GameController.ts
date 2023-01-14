import { Request, Response } from 'express';

class GameController {
	public static index (req: Request, res: Response): void {
		return res.render('game', {
			title: 'jkp'
		});
	}
}

export default GameController;