import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MovieService } from '../core/services/movie.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
})
export class CheckboxComponent implements OnInit {
  movieForm!: FormGroup;
  movieList: string[] = [];
  movieList$: Observable<string[]>;
  constructor(private fb: FormBuilder, private movieService: MovieService) {}

  ngOnInit() {
    this.movieList$ = this.movieService.getMovies().pipe(
      tap((movies) => {
        this.movieList = movies;
        this.initForm(movies);
      })
    );
  }

  initForm(moviesList: string[]) {
    this.movieForm = this.fb.group({
      selectAll: false,
      movies: this.fb.array(moviesList.map(() => false)),
    });

    this.movieForm.get('movies').valueChanges.subscribe((value) => {
      const isAllSelected = value.every(Boolean);
      this.movieForm
        .get('selectAll')
        .setValue(isAllSelected, { emitEvent: false });
    });

    this.movieForm.get('selectAll').valueChanges.subscribe((value) => {
      this.getMoviesArray.controls.forEach((control) =>
        control.setValue(value, { emitEvent: false })
      );
    });
  }

  get getMoviesArray() {
    return this.movieForm.get('movies') as FormArray;
  }

  clear() {
    this.movieForm.get('selectAll').setValue(false, { emitEvent: false });
    this.getMoviesArray.controls.forEach((control) =>
      control.setValue(false, { emitEvent: false })
    );
  }

  selectedMovies() {
    return this.movieList.filter((_, i) => this.getMoviesArray.at(i).value);
  }
}
